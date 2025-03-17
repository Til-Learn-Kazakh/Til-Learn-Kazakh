package analytics

import (
	"context"
	"diploma/src/database"
	"errors"
	"fmt"
	"math"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type AnalyticsService struct {
	Collection *mongo.Collection
}

func NewAnalyticsService() *AnalyticsService {
	return &AnalyticsService{
		Collection: database.GetCollection(database.Client, "Analytics"),
	}
}

func (s *AnalyticsService) UpdateStats(userID string, dateStr string, correct, attempts, mistakes, committedTime, lessons, xp, accuracy int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// 1) Получаем документ статистики пользователя
	filter := bson.M{"userId": userID}
	var stats UserStatistics

	err := s.Collection.FindOne(ctx, filter).Decode(&stats)
	if err == mongo.ErrNoDocuments {
		// Если документа нет, создаём
		stats = UserStatistics{
			ID:           primitive.NewObjectID(),
			UserID:       userID,
			DailyStats:   make(map[string]DailyStats),
			MonthlyStats: make(map[string]MonthlyStats),
			YearlyStats:  make(map[string]YearlyStats),
			LastUpdated:  time.Now(),
		}
	} else if err != nil {
		return err
	}

	parsedDate, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		parsedDate = time.Now()
	}

	yearID := parsedDate.Format("2006")    // "2025"
	monthID := parsedDate.Format("2006-1") // "2025-3" (без ведущих нулей)

	oldDaily := stats.DailyStats[dateStr] // может быть пустой (streak=0)

	// 2) Обновляем DailyStats
	daily := stats.DailyStats[dateStr]
	daily.CorrectTotal += correct
	daily.AttemptsTotal += attempts
	daily.Accuracy = int(math.Round(float64(daily.CorrectTotal) / float64(daily.AttemptsTotal) * 100))
	daily.Mistakes += mistakes
	daily.Time += committedTime
	daily.XP += xp
	daily.Lessons += lessons

	if daily.Streak == 0 {
		daily.Streak = 1
	}
	stats.DailyStats[dateStr] = daily

	// 3) Обновляем MonthlyStats
	m := stats.MonthlyStats[monthID]
	m.CorrectTotal += correct
	m.AttemptsTotal += attempts
	m.Accuracy = int(math.Round(float64(m.CorrectTotal) / float64(m.AttemptsTotal) * 100))
	m.Mistakes += mistakes
	m.Time += committedTime
	m.XP += xp
	m.Lessons += lessons
	if m.Streak == 0 {
		m.Streak = 1
	}
	stats.MonthlyStats[monthID] = m

	// 4) Обновляем YearlyStats
	y := stats.YearlyStats[yearID]
	y.CorrectTotal += correct
	y.AttemptsTotal += attempts
	y.Accuracy = int(math.Round(float64(y.CorrectTotal) / float64(y.AttemptsTotal) * 100))
	y.Mistakes += mistakes
	y.Time += committedTime
	y.XP += xp
	y.Lessons += lessons
	if y.Streak == 0 {
		y.Streak = 1
	}

	if len(y.ActiveDaysPerMonth) < 12 {
		y.ActiveDaysPerMonth = make([]int, 12)
	}

	if oldDaily.Streak == 0 && daily.Streak == 1 {
		// Пользователь впервые получил streak=1 в этом дне
		monthIndex := int(parsedDate.Month()) - 1

		// Если действительно есть какая-то активность (не пустой день)
		if daily.Time > 0 || daily.XP > 0 || daily.Lessons > 0 {
			y.ActiveDaysPerMonth[monthIndex]++
		}
	}

	stats.YearlyStats[yearID] = y

	// 5) Сохраняем обратно в MongoDB
	stats.LastUpdated = time.Now()

	upsert := true
	_, err = s.Collection.UpdateOne(
		ctx,
		filter,
		bson.M{"$set": stats},
		&options.UpdateOptions{Upsert: &upsert},
	)
	if err != nil {
		return err
	}

	return nil
}

func (s *AnalyticsService) GetUserStatistics(userID string) (*UserStatistics, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	var stats UserStatistics
	err := s.Collection.FindOne(ctx, filter).Decode(&stats)
	if err == mongo.ErrNoDocuments {
		return nil, errors.New("no statistics found for user " + userID)
	} else if err != nil {
		return nil, err
	}

	return &stats, nil
}

// 2) Получаем статистику за конкретный день (если есть)
func (s *AnalyticsService) GetDailyStat(userID string, dateStr string) (*DailyStats, error) {
	stats, err := s.GetUserStatistics(userID)
	if err != nil {
		return nil, err
	}
	daily, ok := stats.DailyStats[dateStr]
	if !ok {
		return nil, errors.New("no daily stats for date " + dateStr)
	}
	return &daily, nil
}

func (s *AnalyticsService) GetMonthlyStat(userID string, monthID string) (*MonthlyStatResponse, error) {
	stats, err := s.GetUserStatistics(userID)
	if err != nil {
		return nil, err
	}

	m, ok := stats.MonthlyStats[monthID]
	if !ok {
		return nil, fmt.Errorf("no monthly stats for %s", monthID)
	}

	// monthID формат "2025-3". Нужно сравнить с DailyStats вида "2025-03-12"?
	// У нас бывают ведущие нули. Поступим так: будем парсить DailyStats через time.Parse, а потом проверять (year-month) == monthID.
	// Или сделаем функцию checkMonth(dateStr, monthID) bool

	dayStatsMap := make(map[int]DailyStats)
	for dateStr, daily := range stats.DailyStats {
		// Попробуем парсить "2025-03-12"
		t, err := time.Parse("2006-01-02", dateStr)
		if err != nil {
			continue // пропустим плохие даты
		}

		// Сформируем строку вида "2025-3"
		parsedMonthID := t.Format("2006-1") // без ведущих нулей для месяца
		if parsedMonthID == monthID {
			day := t.Day() // извлекаем число дня (1..31)
			dayStatsMap[day] = daily
		}
	}

	response := &MonthlyStatResponse{
		MonthlyStats: m,
		DayStats:     dayStatsMap,
	}
	return response, nil
}

// 4) Получаем статистику за конкретный год ("2025")
func (s *AnalyticsService) GetYearlyStat(userID string, yearID string) (*YearlyStats, error) {
	stats, err := s.GetUserStatistics(userID)
	if err != nil {
		return nil, err
	}
	y, ok := stats.YearlyStats[yearID]
	if !ok {
		return nil, errors.New("no yearly stats for " + yearID)
	}
	return &y, nil
}
