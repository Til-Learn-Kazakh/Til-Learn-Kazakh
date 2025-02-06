package streak

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Streak struct {
	UserID        primitive.ObjectID `bson:"userId" json:"user_id" validate:"required"`
	CurrentStreak int                `bson:"current_streak" json:"current_streak" validate:"gte=0"`
	MaxStreak     int                `bson:"max_streak" json:"max_streak" validate:"gte=0"`
	LastActive    time.Time          `bson:"last_active" json:"last_active" validate:"required"`
	StreakDays    []string           `bson:"streak_days" json:"streak_days"`
}
