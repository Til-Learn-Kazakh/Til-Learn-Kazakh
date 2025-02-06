package unit

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type LocalizedDescription struct {
	Kazakh  string `bson:"kk" json:"kk"`
	Russian string `bson:"ru" json:"ru"`
	English string `bson:"en" json:"en"`
}

type Unit struct {
	ID           primitive.ObjectID   `bson:"_id,omitempty" json:"id,omitempty"`
	Title        string               `bson:"title" json:"title"`
	LevelID      primitive.ObjectID   `bson:"level_id" json:"level_id"`
	Tasks        []primitive.ObjectID `bson:"tasks" json:"tasks"`
	Completed    []primitive.ObjectID `bson:"completed" json:"completed"` // Список выполненных задач
	Descriptions LocalizedDescription `bson:"descriptions" json:"descriptions"`
	Progress     int                  `json:"progress" bson:"progress"`
	CreatedAt    time.Time            `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time            `bson:"updated_at" json:"updated_at"`
}
