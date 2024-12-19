package auth

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`                      // Уникальный идентификатор в MongoDB
	FirstName string             `bson:"first_name" json:"first_name" validate:"required"`       // Имя пользователя (обязательно)
	LastName  string             `bson:"last_name" json:"last_name" validate:"required"`         // Фамилия пользователя (обязательно)
	Email     string             `bson:"email" json:"email" validate:"required,email"`           // Email пользователя (обязательно)
	Password  string             `bson:"password" json:"password,omitempty" validate:"required"` // Хэшированный пароль (обязательно)
	CreatedAt time.Time          `bson:"created_at" json:"created_at,omitempty"`                 // Дата создания пользователя (генерируется автоматически)
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at,omitempty"`                 // Дата последнего обновления (генерируется автоматически)
}
