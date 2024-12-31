package lesson

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Lesson struct {
	ID        primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`    // Уникальный идентификатор
	Name      string               `bson:"name" json:"name" validate:"required"` // Название модуля
	Icon      string               `bson:"icon" json:"icon" validate:"required"` // Иконка
	Tasks     []primitive.ObjectID `bson:"tasks" json:"tasks"`                   // Список ID уроков
	CreatedAt time.Time            `bson:"created_at" json:"created_at"`         // Дата создания
	UpdatedAt time.Time            `bson:"updated_at" json:"updated_at"`         // Дата обновления
}
