package user

import (
	"context"
	"diploma/src/database"
	"diploma/src/modules/analytics"
	"diploma/src/modules/auth"
	"diploma/src/modules/streak"
	"errors"
	"fmt"
	"math"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
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
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
	} else {
		return nil, errors.New("user not found")
	}

	if user.Streak != nil {
		err := s.checkAndResetStreak(&user)
		if err != nil {
			return nil, err
		}
	}

	return &user, nil
}

func (s *UserService) checkAndResetStreak(user *auth.User) error {
	today := time.Now()
	lastActive := user.Streak.LastActive
	daysSinceLastActive := int(today.Sub(lastActive).Hours() / 24)

	if daysSinceLastActive > 1 {
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

func (s *UserService) CalculateXP(correct, attempts, committedTime, mistakes, combo int) (int, int) {
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

func (s *UserService) UpdateXP(userID, unitID string, correct, attempts, committedTime, mistakes, combo int) (*auth.User, int, int, error) {
	unitObjectID, err := primitive.ObjectIDFromHex(unitID)
	if err != nil {
		return nil, 0, 0, err
	}

	// Получаем пользователя
	user, err := s.GetUserByID(userID)
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
		user.XP += unitXP
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
			accuracy,
		)
		if err != nil {
			return nil, 0, 0, err
		}
	}

	_, err = s.Collection.UpdateOne(
		context.Background(),
		bson.M{"_id": user.ID},
		bson.M{
			"$set": bson.M{"xp": user.XP, "lessons_completed": user.LessonsCompleted},
		},
	)

	if err != nil {
		return nil, 0, 0, err
	}

	// ✅ Вызываем UpdateStreak (streak обновляется всегда)
	streakService := streak.NewStreakService()
	_ = streakService.UpdateStreak(userID)

	return user, unitXP, accuracy, nil
}
