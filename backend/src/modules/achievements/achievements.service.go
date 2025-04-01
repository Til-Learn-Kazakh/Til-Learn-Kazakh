package achievements

import (
	"context"
	"diploma/src/database"
	"diploma/src/modules/auth"
	"diploma/src/modules/streak"
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// AchievementsService - сервис для работы с достижениями
type AchievementsService struct {
	UserCollection         *mongo.Collection
	AchievementsCollection *mongo.Collection
	StreakCollection       *mongo.Collection
}

// NewAchievementsService - создание нового сервиса достижений
func NewAchievementsService() *AchievementsService {
	return &AchievementsService{
		UserCollection:         database.GetCollection(database.Client, "User"),
		AchievementsCollection: database.GetCollection(database.Client, "Achievements"),
		StreakCollection:       database.GetCollection(database.Client, "Streak"),
	}
}

// GetAllAchievements - получает список всех достижений
func (s *AchievementsService) GetAllAchievements(ctx context.Context) ([]Achievement, error) {
	var achievements []Achievement
	cursor, err := s.AchievementsCollection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	if err := cursor.All(ctx, &achievements); err != nil {
		return nil, err
	}
	return achievements, nil
}

// CreateAchievement - создаёт новое достижение
func (s *AchievementsService) CreateAchievement(ctx context.Context, achievement *Achievement) (*Achievement, error) {
	achievement.ID = primitive.NewObjectID()
	achievement.CreatedAt = time.Now()
	achievement.UpdatedAt = time.Now()

	_, err := s.AchievementsCollection.InsertOne(ctx, achievement)
	if err != nil {
		return nil, err
	}
	return achievement, nil
}

// UpdateAchievement - обновляет существующее достижение
func (s *AchievementsService) UpdateAchievement(ctx context.Context, achievementID primitive.ObjectID, updateData bson.M) error {
	filter := bson.M{"_id": achievementID}
	updateData["updated_at"] = time.Now()

	update := bson.M{"$set": updateData}

	_, err := s.AchievementsCollection.UpdateOne(ctx, filter, update)
	return err
}

func (s *AchievementsService) GetAchievementByID(ctx context.Context, id primitive.ObjectID) (*Achievement, error) {
	var ach Achievement
	err := s.AchievementsCollection.FindOne(ctx, bson.M{"_id": id}).Decode(&ach)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, nil
		}
		return nil, err
	}
	return &ach, nil
}

func (*AchievementsService) UserHasAchievement(user *auth.User, achievementID primitive.ObjectID) bool {
	for _, aID := range user.UserAchievements {
		if aID == achievementID {
			return true
		}
	}
	return false
}

func (s *AchievementsService) CheckAndGrantAchievements(ctx context.Context, user *auth.User) error {
	// 1. Получаем все возможные достижения
	allAchievements, err := s.GetAllAchievements(ctx)
	if err != nil {
		return err
	}

	key := fmt.Sprintf("user:achievements_progress:%s", user.ID.Hex())
	shouldInvalidateCache := false

	for i := range allAchievements {
		achievement := &allAchievements[i]
		if s.UserHasAchievement(user, achievement.ID) {
			continue
		}

		// 3. Проверяем условие для каждого типа
		achieved := false
		switch achievement.Type {
		case LessonsCompleted:
			if len(user.LessonsCompleted) >= achievement.Threshold {
				achieved = true
			}

		case PerfectLessons:
			if user.PerfectLessonsCount >= achievement.Threshold {
				achieved = true
			}

		case Streak:
			if user.Streak != nil && user.Streak.CurrentStreak >= achievement.Threshold {
				achieved = true
			}
		}

		if achieved {
			// Добавляем в pending_rewards, чтобы пользователь мог забрать награду
			err := s.MarkAchievementAsAvailable(ctx, user.ID, achievement.ID, achievement.Reward)
			if err != nil {
				return err
			}
			shouldInvalidateCache = true
		}
	}

	if shouldInvalidateCache {
		_ = database.RedisClient.Del(ctx, key).Err()
	}

	return nil
}

func (s *AchievementsService) GetUserAchievementsProgress(ctx context.Context, user *auth.User) ([]AchievementProgress, error) {
	key := fmt.Sprintf("user:achievements_progress:%s", user.ID.Hex())

	cached, err := database.RedisClient.Get(ctx, key).Result()
	if err == nil {
		var progress []AchievementProgress
		if jsonErr := json.Unmarshal([]byte(cached), &progress); jsonErr == nil {
			return progress, nil
		}
	}

	achievements, err := s.GetAllAchievements(ctx)
	if err != nil {
		return nil, err
	}

	var userStreak streak.Streak
	err = s.StreakCollection.FindOne(ctx, bson.M{"userId": user.ID}).Decode(&userStreak)
	if err != nil && !errors.Is(err, mongo.ErrNoDocuments) {
		return nil, err
	}

	var results []AchievementProgress
	for i := range achievements {
		ach := &achievements[i]
		progress := AchievementProgress{
			AchievementID: ach.ID,
			Title:         ach.Title,
			Description:   ach.Description,
			Threshold:     ach.Threshold,
			ImageURL:      ach.ImagePath,
			IsAchieved:    s.UserHasAchievement(user, ach.ID),
		}

		switch ach.Type {
		case LessonsCompleted:
			progress.Current = len(user.LessonsCompleted)
		case PerfectLessons:
			progress.Current = user.PerfectLessonsCount
		case Streak:
			progress.Current = userStreak.CurrentStreak
		}

		results = append(results, progress)
	}

	jsonData, _ := json.Marshal(results)
	_ = database.RedisClient.Set(ctx, key, jsonData, time.Hour).Err() // храним 1 час

	return results, nil
}

// Метод добавляет награду в pending_rewards
func (s *AchievementsService) MarkAchievementAsAvailable(ctx context.Context, userID, achievementID primitive.ObjectID, reward int) error {
	filter := bson.M{"_id": userID}
	update := bson.M{
		"$push": bson.M{"pending_rewards": bson.M{"achievement_id": achievementID, "reward": reward}},
		"$addToSet": bson.M{
			"user_achievements": achievementID,
		},
	}
	_, err := s.UserCollection.UpdateOne(ctx, filter, update)
	if err != nil {
		return err
	}

	_ = database.RedisClient.Del(ctx, fmt.Sprintf("user:achievements_progress:%s", userID.Hex()))
	return nil
}

// Метод для выдачи награды пользователю
func (s *AchievementsService) ClaimAchievementReward(ctx context.Context, userID, achievementID primitive.ObjectID) error {
	var user auth.User
	err := s.UserCollection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)
	if err != nil {
		return err
	}

	// Если pending_rewards нулевое, делаем пустой массив
	if user.PendingRewards == nil {
		user.PendingRewards = []auth.PendingReward{}
	}
	// Находим награду в pending_rewards
	var claimedReward int
	var updatedRewards []auth.PendingReward
	for _, reward := range user.PendingRewards {
		if reward.AchievementID == achievementID {
			claimedReward = reward.Reward
		} else {
			updatedRewards = append(updatedRewards, reward)
		}
	}

	// Если награда не найдена, возвращаем ошибку
	if claimedReward == 0 {
		return mongo.ErrNoDocuments
	}

	// Обновляем баланс кристаллов и pending_rewards (даже если пустой массив)
	updateData := bson.M{
		"$inc": bson.M{"crystals": claimedReward},
	}

	if len(updatedRewards) > 0 {
		updateData["$set"] = bson.M{"pending_rewards": updatedRewards}
	} else {
		updateData["$set"] = bson.M{
			"pending_rewards": []any{},
		}
	}

	_, err = s.UserCollection.UpdateOne(ctx, bson.M{"_id": userID}, updateData)
	if err != nil {
		return err
	}

	_ = database.RedisClient.Del(ctx, fmt.Sprintf("user:achievements_progress:%s", userID.Hex()))
	return nil
}
