package level

import (
	"diploma/src/modules/unit"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Level struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`    // Уникальный идентификатор
	Name      string             `bson:"name" json:"name" validate:"required"` // Название модуля
	Units     []unit.Unit        `bson:"units" json:"units"`                   // Список объектов Unit
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`         // Дата создания
	UpdatedAt time.Time          `bson:"updated_at" json:"updated_at"`         // Дата обновления
}
