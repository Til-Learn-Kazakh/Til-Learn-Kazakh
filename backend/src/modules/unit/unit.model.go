package unit

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Unit struct {
	ID        primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"` // Уникальный идентификатор
	Title     string               `bson:"title" json:"title"`                // Название блока
	LevelID   primitive.ObjectID   `bson:"level_id" json:"level_id"`          // Связь с уровнем
	Tasks     []primitive.ObjectID `bson:"tasks" json:"tasks"`                // Ссылки на задания
	CreatedAt time.Time            `bson:"created_at" json:"created_at"`      // Дата создания
	UpdatedAt time.Time            `bson:"updated_at" json:"updated_at"`      // Дата обновления
}
