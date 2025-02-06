package streak

import (
	"context"
	"diploma/src/database"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type StreakService struct {
	collection *mongo.Collection
}

func NewStreakService() *StreakService {
	return &StreakService{
		collection: database.GetCollection(database.Client, "Streak"),
	}
}

// 1️⃣ Обновление streak (вызывается при завершении урока)
func (s *StreakService) UpdateStreak(req UpdateStreakDTO) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// ✅ Преобразуем `userId` из `string` в `ObjectID`
	objectID, err := primitive.ObjectIDFromHex(req.UserID)
	if err != nil {
		return err
	}

	var streak Streak
	err = s.collection.FindOne(ctx, bson.M{"userId": objectID}).Decode(&streak)

	if errors.Is(err, mongo.ErrNoDocuments) {
		// ✅ **Создаем новый streak с `ObjectID`**
		streak = Streak{
			UserID:        objectID, // ✅ Теперь это `ObjectID`
			CurrentStreak: 0,
			MaxStreak:     0,
			LastActive:    time.Time{},
			StreakDays:    []string{},
		}
		_, err = s.collection.InsertOne(ctx, streak)
		return err
	} else if err != nil {
		return err
	}

	// ✅ Если у пользователя еще не было активности — устанавливаем `LastActive`
	if streak.LastActive.IsZero() {
		streak.LastActive = time.Now()
		streak.CurrentStreak = 1
		streak.MaxStreak = 1
		streak.StreakDays = append(streak.StreakDays, time.Now().Format("2006-01-02"))
	} else {
		today := time.Now().Format("2006-01-02")
		yesterday := time.Now().AddDate(0, 0, -1).Format("2006-01-02")
		dayBeforeYesterday := time.Now().AddDate(0, 0, -2).Format("2006-01-02")

		lastActiveDate := streak.LastActive.Format("2006-01-02")

		if lastActiveDate == yesterday {
			// ✅ Если streak продолжается (был активен вчера)
			streak.CurrentStreak += 1
		} else if lastActiveDate == dayBeforeYesterday {
			// ✅ Если он **пропустил один день**, сбрасываем streak в `0`
			streak.CurrentStreak = 0
		}

		if streak.CurrentStreak == 0 {
			// ✅ Если streak обнулен, начинается новый streak
			streak.CurrentStreak = 1
		}

		if streak.CurrentStreak > streak.MaxStreak {
			streak.MaxStreak = streak.CurrentStreak
		}

		// ✅ Добавляем дату в streakDays
		if !contains(streak.StreakDays, today) {
			streak.StreakDays = append(streak.StreakDays, today)
		}
	}

	// ✅ Обновляем в MongoDB
	_, err = s.collection.UpdateOne(ctx, bson.M{"userId": objectID}, bson.M{
		"$set": bson.M{
			"current_streak": streak.CurrentStreak,
			"max_streak":     streak.MaxStreak,
			"last_active":    time.Now(),
			"streak_days":    streak.StreakDays,
		},
	})
	return err
}

// 2️⃣ Получение streak для пользователя
func (s *StreakService) GetUserStreak(userID string) (*StreakResponseDTO, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// ✅ Преобразуем `userID` в `ObjectID`
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, errors.New("Invalid user ID format")
	}

	var streak Streak
	err = s.collection.FindOne(ctx, bson.M{"userId": objectID}).Decode(&streak)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, errors.New("Streak not found")
	} else if err != nil {
		return nil, err
	}

	return &StreakResponseDTO{
		CurrentStreak: streak.CurrentStreak,
		MaxStreak:     streak.MaxStreak,
		LastActive:    streak.LastActive,
		StreakDays:    streak.StreakDays,
	}, nil
}

// 3️⃣ Сброс streak (если streak прерван)
func (s *StreakService) ResetStreak(req ResetStreakDTO) error {
	_, err := s.collection.UpdateOne(context.TODO(), bson.M{"userId": req.UserID}, bson.M{
		"$set": bson.M{"current_streak": 0, "streak_days": []string{}},
	})
	return err
}

// Вспомогательная функция для проверки, есть ли дата в массиве
func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}
