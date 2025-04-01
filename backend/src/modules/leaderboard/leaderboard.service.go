package leaderboard

import (
	"context"
	"diploma/src/database"
	"encoding/json"
	"log"
	"time"

	"github.com/robfig/cron/v3"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type LeaderboardService struct {
	UserCollection *mongo.Collection
}

func NewLeaderboardService() *LeaderboardService {
	return &LeaderboardService{
		UserCollection: database.GetCollection(database.Client, "User"),
	}
}

func (s *LeaderboardService) GetWeeklyLeaderboard(ctx context.Context, limit int64) ([]bson.M, error) {
	return s.getLeaderboard(ctx, "weekly_xp", limit)
}

func (s *LeaderboardService) GetMonthlyLeaderboard(ctx context.Context, limit int64) ([]bson.M, error) {
	return s.getLeaderboard(ctx, "monthly_xp", limit)
}

func (s *LeaderboardService) GetAllTimeLeaderboard(ctx context.Context, limit int64) ([]bson.M, error) {
	return s.getLeaderboard(ctx, "xp", limit)
}

// 🔥 Общая логика получения лидерборда
func (s *LeaderboardService) getLeaderboard(ctx context.Context, xpField string, limit int64) ([]bson.M, error) {
	cacheKey := "leaderboard:" + xpField

	// 1. Попробуем получить из Redis
	cached, err := database.RedisClient.Get(ctx, cacheKey).Result()
	if err == nil {
		var result []bson.M
		if unmarshalErr := json.Unmarshal([]byte(cached), &result); unmarshalErr == nil {
			return result, nil
		}
	}

	// 2. Если нет — получаем из MongoDB
	opts := options.Find().
		SetSort(bson.D{{Key: xpField, Value: -1}}).
		SetLimit(limit).
		SetProjection(bson.M{
			"_id":        1,
			"first_name": 1,
			"avatar":     1,
			xpField:      1,
		})

	cursor, err := s.UserCollection.Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var leaderboard []bson.M
	if err := cursor.All(ctx, &leaderboard); err != nil {
		return nil, err
	}

	// 3. Сохраняем в Redis на 5 минут
	data, _ := json.Marshal(leaderboard)
	_ = database.RedisClient.Set(ctx, cacheKey, data, 5*time.Minute).Err()

	return leaderboard, nil
}

// 🔄 Автоматический сброс Weekly XP (вызывать каждое воскресенье)
func (s *LeaderboardService) ResetWeeklyXP(ctx context.Context) error {
	_, err := s.UserCollection.UpdateMany(
		ctx,
		bson.M{}, // обновляем всех
		bson.M{"$set": bson.M{"weekly_xp": 0}},
	)
	_ = database.RedisClient.Del(ctx, "leaderboard:weekly_xp").Err()

	return err
}

// 🔄 Автоматический сброс Monthly XP (вызывать 1-го числа каждого месяца)
func (s *LeaderboardService) ResetMonthlyXP(ctx context.Context) error {
	_, err := s.UserCollection.UpdateMany(
		ctx,
		bson.M{}, // обновляем всех
		bson.M{"$set": bson.M{"monthly_xp": 0}},
	)
	_ = database.RedisClient.Del(ctx, "leaderboard:monthly_xp").Err()
	return err
}

func (s *LeaderboardService) ScheduleResetXP() {
	c := cron.New(cron.WithLocation(time.UTC)) // Указываем часовой пояс UTC

	// 📌 Каждое воскресенье в 00:00 (UTC) сбрасываем Weekly XP
	if _, err := c.AddFunc("0 0 * * 0", func() {
		if err := s.ResetWeeklyXP(context.TODO()); err != nil {
			log.Printf("Failed to reset weekly XP: %v", err)
		}
	}); err != nil {
		log.Printf("Failed to schedule weekly XP reset: %v", err)
	}

	// 📌 Первое число каждого месяца в 00:00 (UTC) сбрасываем Monthly XP
	if _, err := c.AddFunc("0 0 1 * *", func() {
		if err := s.ResetMonthlyXP(context.TODO()); err != nil {
			log.Printf("Failed to reset monthly XP: %v", err)
		}
	}); err != nil {
		log.Printf("Failed to schedule monthly XP reset: %v", err)
	}

	// Запуск cron
	c.Start()
}
