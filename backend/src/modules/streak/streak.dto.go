package streak

import "time"

type UpdateStreakDTO struct {
	UserID string `json:"user_id" binding:"required"`
}

type StreakResponseDTO struct {
	CurrentStreak int       `json:"current_streak"` // Текущий streak (дней подряд)
	MaxStreak     int       `json:"max_streak"`     // Максимальный streak
	LastActive    time.Time `json:"last_active"`    // Последняя активность
	StreakDays    []string  `json:"streak_days"`    // Даты, когда был streak
	Week          []bool    `json:"week"`           // Добавили массив активности за неделю

}

type ResetStreakDTO struct {
	UserID string `json:"user_id" binding:"required"`
}
