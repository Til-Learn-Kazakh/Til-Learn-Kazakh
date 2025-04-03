package task

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TaskType string

const (
	TranslationWord    TaskType = "translation_word"     // Перевод слова
	TranslationAudio   TaskType = "translation_audio"    // Перевод предложения
	Audio              TaskType = "audio"                // Воспроизведение аудио
	TapAudio           TaskType = "tap_audio"            // Тап по услышанному
	ChooseCorrectImage TaskType = "choose_correct_image" // Выбери правильное изображение
	FillBlank          TaskType = "fill_blank"           // Закончи предложение
	ReadRespond        TaskType = "read_respond"         // Чтение и ответ
)

type ImageOption struct {
	ID    string            `bson:"id" json:"id"`       // Unique identifier for the option
	Text  map[string]string `bson:"text" json:"text"`   // Localized text
	Image string            `bson:"image" json:"image"` // Image URL or path
}

type Task struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`                        // Уникальный идентификатор задачи
	UnitID        primitive.ObjectID `bson:"unit_id" json:"unit_id" validate:"required"`               // Ссылка на блок
	Type          TaskType           `bson:"type" json:"type" validate:"required"`                     // Тип задачи
	Question      map[string]string  `bson:"question" json:"question" validate:"required"`             // Локализованный вопрос (например, "ru", "en")
	CorrectAnswer string             `bson:"correct_answer,omitempty" json:"correct_answer,omitempty"` // Правильный ответ
	Hints         []string           `bson:"hints,omitempty" json:"hints,omitempty"`
	Order         int                `bson:"order" json:"order" validate:"gte=0"` // Порядок выполнения задачи
	CreatedAt     time.Time          `bson:"created_at" json:"created_at"`        // Дата создания
	UpdatedAt     time.Time          `bson:"updated_at" json:"updated_at"`        // Дата обновления

	AudioPath string `bson:"audio_path,omitempty" json:"audio_path,omitempty"`

	// TranslationWord
	ImagePath string `bson:"image_path,omitempty" json:"image_path,omitempty"`

	// Fill_Blank
	Sentence []string `bson:"sentence,omitempty" json:"sentence,omitempty"`

	// Read and Respond
	Description     map[string]string `bson:"description,omitempty" json:"description,omitempty"`
	HighlightedWord map[string]string `bson:"highlighted_word,omitempty" json:"highlighted_word,omitempty"`

	// ChooseCorrectImage specific
	ImageOptions []ImageOption `bson:"image_options,omitempty" json:"image_options,omitempty"`

	// Новые поля для локализованного варианта
	LocalizedHints         map[string][]string `bson:"localized_hints,omitempty" json:"localized_hints,omitempty"`
	LocalizedCorrectAnswer map[string]string   `bson:"localized_correct_answer,omitempty" json:"localized_correct_answer,omitempty"`
}
