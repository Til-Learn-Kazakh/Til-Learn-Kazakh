package task

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TaskType string

const (
	MissingLetter TaskType = "missing_letter" // Пропущенные буквы
	Translation   TaskType = "translation"    // Перевод
	Audio         TaskType = "audio"          // Что вы услышали
	PairMatching  TaskType = "pair_matching"  // Найти пару слов
	CompleteText  TaskType = "complete_text"  // Закончи предложение
)

type Task struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`                 // Уникальный идентификатор задачи
	UnitID        primitive.ObjectID `bson:"unit_id" json:"unit_id" validate:"required"`        // Ссылка на блок
	Type          TaskType           `bson:"type" json:"type" validate:"required"`              // Тип задачи
	Question      map[string]string  `bson:"question" json:"question" validate:"required"`      // Локализованный вопрос (например, "ru", "en")
	CorrectAnswer string             `bson:"correct_answer" json:"correct_answer"`              // Правильный ответ
	Hints         []string           `bson:"hints" json:"hints" validate:"min=2,dive,required"` // Подсказки или варианты ответа
	AudioPath     string             `bson:"audio_path,omitempty" json:"audio_path,omitempty"`  // Путь к аудиофайлу (для audio задач)
	ImagePath     string             `bson:"image_path,omitempty" json:"image_path,omitempty"`  // Путь к изображению (для задач с картинками)
	Order         int                `bson:"order" json:"order" validate:"gte=0"`               // Порядок выполнения задачи
	CreatedAt     time.Time          `bson:"created_at" json:"created_at"`                      // Дата создания
	UpdatedAt     time.Time          `bson:"updated_at" json:"updated_at"`                      // Дата обновления
}
