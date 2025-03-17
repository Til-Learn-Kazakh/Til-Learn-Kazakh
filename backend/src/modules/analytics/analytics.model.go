package analytics

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// DailyStats - статистика за один день
type DailyStats struct {
	Lessons  int `bson:"lessons" json:"lessons"`
	Accuracy int `bson:"accuracy" json:"accuracy"` // % точности
	Time     int `bson:"time" json:"time"`
	Mistakes int `bson:"mistakes" json:"mistakes"`
	XP       int `bson:"xp" json:"xp"`         // Количество опыта
	Streak   int `bson:"streak" json:"streak"` // Серия дней

	CorrectTotal  int `bson:"correctTotal"  json:"correctTotal"`
	AttemptsTotal int `bson:"attemptsTotal" json:"attemptsTotal"`
}

// MonthlyStats - общая статистика за месяц
type MonthlyStats struct {
	Lessons  int `bson:"lessons" json:"lessons"`
	Accuracy int `bson:"accuracy" json:"accuracy"`
	Time     int `bson:"time" json:"time"`
	Mistakes int `bson:"mistakes" json:"mistakes"`
	XP       int `bson:"xp" json:"xp"`
	Streak   int `bson:"streak" json:"streak"`

	CorrectTotal  int `bson:"correctTotal"  json:"correctTotal"`
	AttemptsTotal int `bson:"attemptsTotal" json:"attemptsTotal"`
}

// YearlyStats - статистика за год
type YearlyStats struct {
	Lessons            int   `bson:"lessons" json:"lessons"`
	Accuracy           int   `bson:"accuracy" json:"accuracy"`
	Time               int   `bson:"time" json:"time"`
	Mistakes           int   `bson:"mistakes" json:"mistakes"`
	XP                 int   `bson:"xp" json:"xp"`
	Streak             int   `bson:"streak" json:"streak"`
	ActiveDaysPerMonth []int `bson:"active_days_per_month" json:"activeDaysPerMonth"` // 🆕 Кол-во активных дней

	CorrectTotal  int `bson:"correctTotal"  json:"correctTotal"`
	AttemptsTotal int `bson:"attemptsTotal" json:"attemptsTotal"`
}

// UserStatistics - основная модель статистики
type UserStatistics struct {
	ID           primitive.ObjectID      `bson:"_id,omitempty" json:"id"`
	UserID       string                  `bson:"userId" json:"userId"`
	DailyStats   map[string]DailyStats   `bson:"dailyStats" json:"dailyStats"`     // "2025-03-12": {...}
	MonthlyStats map[string]MonthlyStats `bson:"monthlyStats" json:"monthlyStats"` // "2025-3": {...}
	YearlyStats  map[string]YearlyStats  `bson:"yearlyStats" json:"yearlyStats"`   // "2025": {...}
	LastUpdated  time.Time               `bson:"lastUpdated" json:"lastUpdated"`
}
