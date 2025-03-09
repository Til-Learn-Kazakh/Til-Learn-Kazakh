package auth

import (
	"diploma/src/modules/streak"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID               primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`                      // Уникальный идентификатор в MongoDB
	FirstName        string               `bson:"first_name" json:"first_name" validate:"required"`       // Имя пользователя (обязательно)
	LastName         string               `bson:"last_name" json:"last_name" validate:"required"`         // Фамилия пользователя (обязательно)
	Email            string               `bson:"email" json:"email" validate:"required,email"`           // Email пользователя (обязательно)
	Password         string               `bson:"password" json:"password,omitempty" validate:"required"` // Хэшированный пароль (обязательно)
	Hearts           int                  `bson:"hearts" json:"hearts" validate:"required"`               // Сердечки (жизни)
	Crystals         int                  `bson:"crystals" json:"crystals" validate:"required"`           // Кристаллы
	LessonsCompleted []primitive.ObjectID `bson:"lessons_completed" json:"lessons_completed"`             // Завершенные уроки
	LastRefillAt     time.Time            `bson:"last_refill_at" json:"last_refill_at,omitempty"`
	Streak           *streak.Streak       `bson:"streak,omitempty" json:"streak,omitempty"`
	XP               int                  `bson:"xp" json:"xp"`
	// CurrentTask      primitive.ObjectID   `bson:"current_task" json:"current_task"`                       // Текущая задача
	CreatedAt time.Time `bson:"created_at" json:"created_at,omitempty"` // Дата создания пользователя (генерируется автоматически)
	UpdatedAt time.Time `bson:"updated_at" json:"updated_at,omitempty"` // Дата последнего обновления (генерируется автоматически)
}
