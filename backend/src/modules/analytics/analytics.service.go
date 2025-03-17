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

func (*AnalyticsService) updateDailyStats(daily *DailyStats, correct, attempts, mistakes, committedTime, lessons, xp int) {
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
}

func (*AnalyticsService) updateMonthlyStats(monthly *MonthlyStats, correct, attempts, mistakes, committedTime, lessons, xp int) {
	monthly.CorrectTotal += correct
	monthly.AttemptsTotal += attempts
	monthly.Accuracy = int(math.Round(float64(monthly.CorrectTotal) / float64(monthly.AttemptsTotal) * 100))
	monthly.Mistakes += mistakes
	monthly.Time += committedTime
	monthly.XP += xp
	monthly.Lessons += lessons

	if monthly.Streak == 0 {
		monthly.Streak = 1
	}
}

func (*AnalyticsService) updateYearlyStats(yearly *YearlyStats, correct, attempts, mistakes, committedTime, lessons, xp int, parsedDate time.Time) {
	yearly.CorrectTotal += correct
	yearly.AttemptsTotal += attempts
	yearly.Accuracy = int(math.Round(float64(yearly.CorrectTotal) / float64(yearly.AttemptsTotal) * 100))
	yearly.Mistakes += mistakes
	yearly.Time += committedTime
	yearly.XP += xp
	yearly.Lessons += lessons

	if yearly.Streak == 0 {
		yearly.Streak = 1
	}

	// Если массив ActiveDaysPerMonth недостаточной длины, расширяем его
	if len(yearly.ActiveDaysPerMonth) < 12 {
		yearly.ActiveDaysPerMonth = make([]int, 12)
	}

	// Добавляем активный день, если впервые streak стал 1
	monthIndex := int(parsedDate.Month()) - 1
	if yearly.ActiveDaysPerMonth[monthIndex] == 0 {
		yearly.ActiveDaysPerMonth[monthIndex] = 1
	}
}

func (s *AnalyticsService) UpdateStats(userID, dateStr string, correct, attempts, mistakes, committedTime, lessons, xp int) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// 1) Получаем документ статистики пользователя
	filter := bson.M{"userId": userID}
	var stats UserStatistics

	err := s.Collection.FindOne(ctx, filter).Decode(&stats)
	if errors.Is(err, mongo.ErrNoDocuments) {
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
	yearID := parsedDate.Format("2006")
	monthID := parsedDate.Format("2006-1")

	daily := stats.DailyStats[dateStr]
	s.updateDailyStats(&daily, correct, attempts, mistakes, committedTime, lessons, xp)
	stats.DailyStats[dateStr] = daily

	monthly := stats.MonthlyStats[monthID]
	s.updateMonthlyStats(&monthly, correct, attempts, mistakes, committedTime, lessons, xp)
	stats.MonthlyStats[monthID] = monthly

	yearly := stats.YearlyStats[yearID]
	s.updateYearlyStats(&yearly, correct, attempts, mistakes, committedTime, lessons, xp, parsedDate)
	stats.YearlyStats[yearID] = yearly

	stats.LastUpdated = time.Now()
	upsert := true
	_, err = s.Collection.UpdateOne(ctx, filter, bson.M{"$set": stats}, &options.UpdateOptions{Upsert: &upsert})
	return err
}

func (s *AnalyticsService) GetUserStatistics(userID string) (*UserStatistics, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{"userId": userID}
	var stats UserStatistics
	err := s.Collection.FindOne(ctx, filter).Decode(&stats)
	if errors.Is(err, mongo.ErrNoDocuments) {
		return nil, errors.New("no statistics found for user " + userID)
	} else if err != nil {
		return nil, err
	}

	return &stats, nil
}

// 2) Получаем статистику за конкретный день (если есть)
func (s *AnalyticsService) GetDailyStat(userID, dateStr string) (*DailyStats, error) {
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

func (s *AnalyticsService) GetMonthlyStat(userID, monthID string) (*MonthlyStatResponse, error) {
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
func (s *AnalyticsService) GetYearlyStat(userID, yearID string) (*YearlyStats, error) {
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
