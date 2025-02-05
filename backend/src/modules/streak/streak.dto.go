package streak

import "time"

type UpdateStreakDTO struct {
	UserID string `json:"user_id" binding:"required"` // ID пользователя
}

// DTO для ответа о текущем streak
type StreakResponseDTO struct {
	CurrentStreak int       `json:"current_streak"` // Текущий streak (дней подряд)
	MaxStreak     int       `json:"max_streak"`     // Максимальный streak
	LastActive    time.Time `json:"last_active"`    // Последняя активность
	StreakDays    []string  `json:"streak_days"`    // Даты, когда был streak
}

// DTO для сброса streak
type ResetStreakDTO struct {
	UserID string `json:"user_id" binding:"required"` // ID пользователя
}
