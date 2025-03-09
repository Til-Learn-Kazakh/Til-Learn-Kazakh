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

func (s *StreakService) UpdateStreak(userID string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return err
	}

	var streak Streak
	err = s.collection.FindOne(ctx, bson.M{"userId": objectID}).Decode(&streak)

	if errors.Is(err, mongo.ErrNoDocuments) {
		// ✅ Создаем новый streak, если его нет
		streak = Streak{
			UserID:        objectID,
			CurrentStreak: 1,
			MaxStreak:     1,
			LastActive:    time.Now(),
			StreakDays:    []string{time.Now().Format("2006-01-02")},
		}
		_, err = s.collection.InsertOne(ctx, streak)
		return err
	} else if err != nil {
		return err
	}

	// ✅ Проверяем последний активный день
	today := time.Now().Format("2006-01-02")
	yesterday := time.Now().AddDate(0, 0, -1).Format("2006-01-02")
	lastActiveDate := streak.LastActive.Format("2006-01-02")

	if lastActiveDate == today {
		// 🔹 Уже обновляли streak сегодня, ничего не делаем
		return nil
	} else if lastActiveDate == yesterday {
		// 🔹 Продолжаем streak
		streak.CurrentStreak += 1
	} else {
		// 🔹 Сброс streak, если был разрыв
		streak.CurrentStreak = 1
		streak.StreakDays = []string{}
	}

	// ✅ Обновляем максимальный streak
	if streak.CurrentStreak > streak.MaxStreak {
		streak.MaxStreak = streak.CurrentStreak
	}

	// ✅ Добавляем дату в StreakDays
	streak.StreakDays = append(streak.StreakDays, today)

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

func (s *StreakService) GetUserStreak(userID string) (*StreakResponseDTO, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

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

	// ✅ Создаем массив `week` (7 дней)
	week := make([]bool, 7)

	// ✅ Заполняем массив `week` на основе streak.StreakDays
	for _, streakDay := range streak.StreakDays {
		parsedTime, err := time.Parse("2006-01-02", streakDay)
		if err != nil {
			continue // Пропускаем ошибки парсинга
		}

		dayIndex := int(parsedTime.Weekday()) // Определяем день недели (0 = Sunday, 6 = Saturday)
		week[dayIndex] = true                 // Устанавливаем `true` для этого дня
	}

	// ✅ Возвращаем правильный массив `week`
	return &StreakResponseDTO{
		CurrentStreak: streak.CurrentStreak,
		MaxStreak:     streak.MaxStreak,
		LastActive:    streak.LastActive,
		StreakDays:    streak.StreakDays,
		Week:          week,
	}, nil
}

func (s *StreakService) ResetStreak(req ResetStreakDTO) error {
	_, err := s.collection.UpdateOne(context.TODO(), bson.M{"userId": req.UserID}, bson.M{
		"$set": bson.M{"current_streak": 0, "streak_days": []string{}},
	})
	return err
}

func contains(slice []string, item string) bool {
	for _, s := range slice {
		if s == item {
			return true
		}
	}
	return false
}
