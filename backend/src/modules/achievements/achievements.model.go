package achievements

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type AchievementType string

const (
	LessonsCompleted AchievementType = "lessons_completed"
	PerfectLessons   AchievementType = "perfect_lessons"
	Streak           AchievementType = "streak"
)

type Achievement struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Title       string             `bson:"title" json:"title"`             // Название достижения
	Description string             `bson:"description" json:"description"` // Описание достижения
	Type        AchievementType    `bson:"type" json:"type"`               // Тип достижения (enum)
	Threshold   int                `bson:"threshold" json:"threshold"`     // Значение для получения достижения
	Reward      int                `bson:"reward" json:"reward"`           // Сколько Crystals получает пользователь
	ImagePath   string             `bson:"image_path" json:"image_path"`   // Ссылка на картинку достижения
	CreatedAt   time.Time          `bson:"created_at" json:"created_at,omitempty"`
	UpdatedAt   time.Time          `bson:"updated_at" json:"updated_at,omitempty"`
}

type UserAchievement struct {
	AchievementID primitive.ObjectID `bson:"achievement_id" json:"achievement_id"`
	AchievedAt    time.Time          `bson:"achieved_at" json:"achieved_at"`
}
