package user

import (
	"context"
	"diploma/src/database"
	"diploma/src/modules/achievements"
	"diploma/src/modules/analytics"
	"diploma/src/modules/auth"
	"diploma/src/modules/streak"
	"diploma/src/utils"
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	MaxHearts      = 5
	RefillInterval = 5 * time.Minute
	RefillCost     = 500
)

type UserService struct {
	Collection *mongo.Collection
}

func NewUserService() *UserService {
	return &UserService{
		Collection: database.GetCollection(database.Client, "User"),
	}
}

func (s *UserService) GetAllUsers() ([]auth.User, error) {
	ctx := context.Background()

	cursor, err := s.Collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, fmt.Errorf("failed to find users: %w", err)
	}
	defer cursor.Close(ctx)

	var users []auth.User
	if err := cursor.All(ctx, &users); err != nil {
		return nil, fmt.Errorf("failed to decode users: %w", err)
	}

	return users, nil
}

func (s *UserService) GetUserByID(userID string) (*auth.User, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pipeline := mongo.Pipeline{
		bson.D{{Key: "$match", Value: bson.M{"_id": objectID}}},
		bson.D{{Key: "$lookup", Value: bson.M{
			"from":         "Streak",
			"localField":   "_id",
			"foreignField": "userId",
			"as":           "streak",
		}}},
		bson.D{{Key: "$unwind", Value: bson.M{
			"path":                       "$streak",
			"preserveNullAndEmptyArrays": true,
		}}},
	}

	cursor, err := s.Collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var user auth.User
	if cursor.Next(ctx) {
		if decodeErr := cursor.Decode(&user); decodeErr != nil {
			return nil, decodeErr
		}
	} else {
		return nil, errors.New("user not found")
	}

	if user.Email, err = utils.Decrypt(user.Email); err != nil {
		return nil, err
	}

	if user.Streak != nil {
		err := s.checkAndResetStreak(&user)
		if err != nil {
			return nil, err
		}
	}

	return &user, nil
}

func (s *UserService) DeleteUser(userID string) error {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	// Start a session to handle the transaction (if needed)
	session, err := database.Client.StartSession()
	if err != nil {
		return err
	}
	defer session.EndSession(context.Background())

	// Begin transaction
	err = session.StartTransaction()
	if err != nil {
		return err
	}

	// Define context with a timeout for the delete operation
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Delete the user document
	_, err = s.Collection.DeleteOne(ctx, bson.M{"_id": objectID})
	if err != nil {
		// Abort transaction and check for error
		if abortErr := session.AbortTransaction(ctx); abortErr != nil {
			return fmt.Errorf("failed to abort transaction: %w", abortErr)
		}
		return err
	}

	// Delete related streaks or other dependent data if necessary
	streakCollection := database.GetCollection(database.Client, "Streak")
	_, err = streakCollection.DeleteMany(ctx, bson.M{"userId": objectID})
	if err != nil {
		// Abort transaction and check for error
		if abortErr := session.AbortTransaction(ctx); abortErr != nil {
			return fmt.Errorf("failed to abort transaction: %w", abortErr)
		}
		return err
	}

	// Commit the transaction
	err = session.CommitTransaction(ctx)
	if err != nil {
		return err
	}

	_ = database.RedisClient.Del(
		context.Background(),
		"leaderboard:xp",
		"leaderboard:weekly_xp",
		"leaderboard:monthly_xp",
	)

	return nil
}

func (s *UserService) UpdateUserProfile(ctx context.Context, userID string, dto UpdateUserDto) (*auth.User, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	updateFields := bson.M{
		"first_name": dto.FirstName,
		"last_name":  dto.LastName,
	}

	// Если в DTO пришёл новый Email — шифруем и пересчитываем hash
	if dto.Email != "" {
		encryptedEmail, err := utils.Encrypt(dto.Email)
		if err != nil {
			return nil, err
		}
		updateFields["email"] = encryptedEmail

		newEmailHash := utils.GetEmailHash(dto.Email)
		updateFields["email_hash"] = newEmailHash
	}

	filter := bson.M{"_id": objectID}
	update := bson.M{"$set": updateFields}

	result := s.Collection.FindOneAndUpdate(
		ctx,
		filter,
		update,
		options.FindOneAndUpdate().SetReturnDocument(options.After),
	)
	if result.Err() != nil {
		return nil, result.Err()
	}

	var updatedUser auth.User
	if err := result.Decode(&updatedUser); err != nil {
		return nil, err
	}

	// Расшифруем email для возвращения во фронт
	if updatedUser.Email != "" {
		decryptedEmail, err := utils.Decrypt(updatedUser.Email)
		if err == nil {
			updatedUser.Email = decryptedEmail
		}
	}

	return &updatedUser, nil
}

func (s *UserService) UpdateUserAvatar(ctx context.Context, userID, avatar string) (*auth.User, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	filter := bson.M{"_id": objectID}
	update := bson.M{
		"$set": bson.M{
			"avatar": avatar,
		},
	}

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)
	result := s.Collection.FindOneAndUpdate(ctx, filter, update, opts)
	if result.Err() != nil {
		return nil, result.Err()
	}

	var updatedUser auth.User
	if err := result.Decode(&updatedUser); err != nil {
		return nil, err
	}

	cacheKeys := []string{"leaderboard:xp", "leaderboard:weekly_xp", "leaderboard:monthly_xp"}

	for _, key := range cacheKeys {
		cached, err := database.RedisClient.Get(ctx, key).Result()
		if err != nil {
			continue
		}

		var leaderboard []bson.M
		if err := json.Unmarshal([]byte(cached), &leaderboard); err != nil {
			continue
		}

		// Обновляем аватар пользователя
		updated := false
		for _, entry := range leaderboard {
			if entry["_id"] == userID {
				entry["avatar"] = avatar
				updated = true
				break
			}
		}

		// Перезаписываем в Redis
		if updated {
			newData, _ := json.Marshal(leaderboard)
			_ = database.RedisClient.Set(ctx, key, newData, 5*time.Minute).Err()
		}
	}

	return &updatedUser, nil
}

func (s *UserService) ChangePassword(ctx context.Context, userID string, dto ChangePasswordDto) error {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	var user auth.User
	err = s.Collection.FindOne(ctx, bson.M{"_id": objectID}).Decode(&user)
	if err != nil {
		return err
	}

	// Проверка старого пароля
	isValid, _ := auth.VerifyPassword(dto.OldPassword, user.Password)
	if !isValid {
		return errors.New("старый пароль введён неверно")
	}

	// Хеширование нового пароля
	hashedPassword := auth.HashPassword(dto.NewPassword)

	if dto.NewPassword != dto.ConfirmPassword {
		return errors.New("новый пароль и подтверждение не совпадают")
	}

	// Обновление пароля
	_, err = s.Collection.UpdateOne(
		ctx,
		bson.M{"_id": objectID},
		bson.M{"$set": bson.M{"password": hashedPassword}},
	)

	return err
}

func (*UserService) checkAndResetStreak(user *auth.User) error {
	today := time.Now()
	lastActive := user.Streak.LastActive
	daysSinceLastActive := int(today.Sub(lastActive).Hours() / 24)

	if daysSinceLastActive >= 1 {
		// 🔹 Если пропущен день, сбрасываем streak в коллекции `Streak`
		user.Streak.CurrentStreak = 0

		_, err := database.GetCollection(database.Client, "Streak").UpdateOne(
			context.Background(),
			bson.M{"userId": user.ID},
			bson.M{
				"$set": bson.M{
					"current_streak": 0,
				},
			},
		)
		if err != nil {
			return err
		}
	}

	return nil
}

// RefillHearts выполняет автоматическое восстановление сердец,
// исходя из времени, прошедшего с момента последнего refill.
func (s *UserService) RefillHearts(userID string) (*auth.User, error) {
	user, err := s.GetUserByID(userID)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	elapsed := now.Sub(user.LastRefillAt)

	if user.Hearts < MaxHearts {
		refillable := int(elapsed / RefillInterval)
		if refillable > 0 {
			user.Hearts += refillable
			if user.Hearts > MaxHearts {
				user.Hearts = MaxHearts
			}

			// Сколько "остатка" времени прошло с последнего целого интервала
			remaining := elapsed % RefillInterval
			user.LastRefillAt = now.Add(-remaining)

			_, err = s.Collection.UpdateOne(
				context.Background(),
				bson.M{"_id": user.ID},
				bson.M{
					"$set": bson.M{
						"hearts":         user.Hearts,
						"last_refill_at": user.LastRefillAt,
					},
				},
			)
			if err != nil {
				return nil, err
			}
		}
	}

	return user, nil
}

func (s *UserService) RefillHeartsWithCrystals(userID string) (*auth.User, error) {
	user, err := s.GetUserByID(userID)
	if err != nil {
		return nil, err
	}

	if user.Crystals < RefillCost {
		return nil, errors.New("not enough crystals")
	}
	if user.Hearts >= MaxHearts {
		return nil, errors.New("hearts are already full")
	}

	user.Crystals -= RefillCost
	user.Hearts = MaxHearts

	_, err = s.Collection.UpdateOne(
		context.Background(),
		bson.M{"_id": user.ID},
		bson.M{"$set": bson.M{"hearts": user.Hearts, "crystals": user.Crystals}},
	)
	if err != nil {
		return nil, err
	}

	return user, nil
}

func (s *UserService) DecreaseUserHeart(userID primitive.ObjectID) error {
	// Обновляем количество сердец (-1), но не даём уйти в отрицательные значения
	filter := bson.M{"_id": userID, "hearts": bson.M{"$gt": 0}}
	update := bson.M{
		"$inc": bson.M{"hearts": -1},
		"$set": bson.M{"last_refill_at": time.Now()}, // Обновляем время последнего refil
	}

	result, err := s.Collection.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		return fmt.Errorf("failed to update user hearts: %w", err)
	}

	// Если пользователь не найден или сердца уже были 0
	if result.MatchedCount == 0 {
		return fmt.Errorf("no hearts left or user not found")
	}

	return nil
}

func (*UserService) CalculateXP(correct, attempts, committedTime, mistakes, combo int) (xp, accuracy int) {
	baseXP := 10

	// Считаем accuracy "на лету"
	var accuracyPercent int
	if attempts > 0 {
		accuracyPercent = int(math.Round(float64(correct) / float64(attempts) * 100))
	} else {
		accuracyPercent = 0
	}

	// Дополнительный XP за отсутствие ошибок
	if mistakes == 0 {
		baseXP += 7
	} else {
		// Бонус за комбо (учитывается только если были ошибки)
		if combo >= 7 {
			baseXP += 5
		} else if combo >= 5 {
			baseXP += 3
		} else if combo >= 3 {
			baseXP += 1
		}
	}

	// Испытание на время
	if committedTime < 45 {
		baseXP += 7
	} else if committedTime < 80 {
		baseXP += 5
	} else if committedTime > 150 {
		baseXP += 2
	}

	// Добавляем XP за точность
	switch {
	case accuracyPercent >= 90:
		baseXP += 5
	case accuracyPercent >= 75:
		baseXP += 3
	case accuracyPercent >= 50:
		baseXP += 1
	}

	return baseXP, accuracyPercent
}

func (s *UserService) UpdateXP(userID, unitID string, correct, attempts, committedTime, mistakes, combo int) (user *auth.User, xp, accuracy int, err error) {
	unitObjectID, err := primitive.ObjectIDFromHex(unitID)
	if err != nil {
		return nil, 0, 0, err
	}

	// Получаем пользователя
	user, err = s.GetUserByID(userID)
	if err != nil {
		return nil, 0, 0, err
	}

	//  Проверяем, проходил ли он этот `unitId` раньше
	unitAlreadyCompleted := false
	for _, completed := range user.LessonsCompleted {
		if completed == unitObjectID {
			unitAlreadyCompleted = true
			break
		}
	}

	unitXP, accuracy := s.CalculateXP(correct, attempts, committedTime, mistakes, combo)

	//  Если unit уже был пройден, не даем XP, но позволяем сохранить прохождение
	if unitAlreadyCompleted {
		unitXP = 0
	} else {
		if mistakes == 0 {
			user.PerfectLessonsCount += 1
		}
		user.XP += unitXP
		user.WeeklyXP += unitXP
		user.MonthlyXP += unitXP
		user.LessonsCompleted = append(user.LessonsCompleted, unitObjectID)

		analyticsSvc := analytics.NewAnalyticsService()
		dateStr := time.Now().Format("2006-01-02")

		err = analyticsSvc.UpdateStats(
			userID,
			dateStr,
			correct,
			attempts, // превращаем float64 -> int, или пересчитываем
			mistakes,
			committedTime,
			/* lessons= */ 1,
			unitXP,
		)
		if err != nil {
			return nil, 0, 0, err
		}
	}

	_, err = s.Collection.UpdateOne(
		context.Background(),
		bson.M{"_id": user.ID},
		bson.M{
			"$set": bson.M{"xp": user.XP,
				"weekly_xp":             user.WeeklyXP,
				"monthly_xp":            user.MonthlyXP,
				"lessons_completed":     user.LessonsCompleted,
				"perfect_lessons_count": user.PerfectLessonsCount,
			},
		},
	)

	if err != nil {
		return nil, 0, 0, err
	}

	// ✅ Вызываем UpdateStreak (streak обновляется всегда)
	streakService := streak.NewStreakService()
	_ = streakService.UpdateStreak(userID)

	achievementsSvc := achievements.NewAchievementsService()
	err = achievementsSvc.CheckAndGrantAchievements(context.Background(), user)
	if err != nil {
		fmt.Printf("[UpdateXP] ❌ Error checking achievements: %v\n", err)
	} else {
		fmt.Println("[UpdateXP] ✅ Achievements checked.")
	}

	cacheKey := fmt.Sprintf("user:achievements_progress:%s", user.ID.Hex())
	_ = database.RedisClient.Del(context.Background(), cacheKey)

	leaderboardKeys := []string{
		"leaderboard:xp",
		"leaderboard:weekly_xp",
		"leaderboard:monthly_xp",
	}

	for _, key := range leaderboardKeys {
		cached, err := database.RedisClient.Get(context.Background(), key).Result()
		if err != nil {
			continue
		}

		var leaderboard []bson.M
		if err := json.Unmarshal([]byte(cached), &leaderboard); err != nil {
			continue
		}

		updated := false
		for _, entry := range leaderboard {
			if entry["_id"] == user.ID.Hex() {
				// Обновляем XP поля
				entry["xp"] = user.XP
				entry["weekly_xp"] = user.WeeklyXP
				entry["monthly_xp"] = user.MonthlyXP
				entry["avatar"] = user.Avatar
				entry["first_name"] = user.FirstName
				updated = true
				break
			}
		}

		if updated {
			newData, _ := json.Marshal(leaderboard)
			_ = database.RedisClient.Set(context.Background(), key, newData, 5*time.Minute).Err()
		}
	}

	return user, unitXP, accuracy, nil
}
