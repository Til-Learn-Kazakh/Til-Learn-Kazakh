package user

import (
	"context"
	"diploma/src/database"
	"diploma/src/modules/auth"
	"diploma/src/modules/streak"
	"errors"
	"fmt"
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

	return &user, nil
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

func (s *UserService) CalculateXP(accuracy float64, committedTime, mistakes, combo int) int {
	baseXP := 10

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

	// Испытание на время (добавляем XP, а не заменяем!)
	if committedTime < 45 {
		baseXP += 7
	} else if committedTime < 80 {
		baseXP += 5
	} else if committedTime > 150 {
		baseXP += 2
	}

	//  Новый блок: Добавляем XP за точность (accuracy)
	if accuracy >= 90 {
		baseXP += 5
	} else if accuracy >= 75 {
		baseXP += 3
	} else if accuracy >= 50 {
		baseXP += 1
	}

	return baseXP
}

func (s *UserService) UpdateXP(userID string, unitID string, accuracy float64, committedTime int, mistakes int, combo int) (*auth.User, int, error) {
	unitObjectID, err := primitive.ObjectIDFromHex(unitID)
	if err != nil {
		return nil, 0, err
	}

	// Получаем пользователя
	user, err := s.GetUserByID(userID)
	if err != nil {
		return nil, 0, err
	}

	//  Проверяем, проходил ли он этот `unitId` раньше
	unitAlreadyCompleted := false
	for _, completed := range user.LessonsCompleted {
		if completed == unitObjectID {
			unitAlreadyCompleted = true
			break
		}
	}

	//  Если unit уже был пройден, не даем XP, но позволяем сохранить прохождение
	unitXP := 0
	if !unitAlreadyCompleted {
		unitXP = s.CalculateXP(accuracy, committedTime, mistakes, combo)
		user.XP += unitXP
	}

	// ✅ Добавляем `unitId` в `LessonsCompleted`, если его еще нет
	if !unitAlreadyCompleted {
		user.LessonsCompleted = append(user.LessonsCompleted, unitObjectID)
	}

	_, err = s.Collection.UpdateOne(
		context.Background(),
		bson.M{"_id": user.ID},
		bson.M{
			"$set": bson.M{"xp": user.XP, "lessons_completed": user.LessonsCompleted},
		},
	)

	if err != nil {
		return nil, 0, err
	}

	// ✅ Вызываем UpdateStreak (streak обновляется всегда)
	streakService := streak.NewStreakService()
	_ = streakService.UpdateStreak(userID)

	return user, unitXP, nil
}
