package task

type CreateTaskDTO struct {
	UnitID          string            `json:"unit_id" validate:"required"`        // ID блока
	Type            string            `json:"type" validate:"required"`           // Тип задачи
	Question        map[string]string `json:"question" validate:"required"`       // Локализованный вопрос
	CorrectAnswer   string            `json:"correct_answer" validate:"required"` // Правильный ответ
	Hints           []string          `json:"hints,omitempty"`                    // Подсказки или варианты ответа
	AudioPath       string            `json:"audio_path,omitempty"`               // Путь к аудиофайлу
	ImagePath       string            `json:"image_path,omitempty"`               // Путь к изображению
	Order           int               `json:"order" validate:"gte=0"`             // Порядок выполнения задачи
	Sentence        []string          `json:"sentence,omitempty"`                 // Только для FillBlank
	Description     map[string]string `json:"description,omitempty"`
	HighlightedWord map[string]string `json:"highlighted_word,omitempty"`
	ImageOptions    []ImageOption     `json:"image_options,omitempty" validate:"dive"`

	LocalizedHints         map[string][]string `json:"localized_hints,omitempty"`
	LocalizedCorrectAnswer map[string]string   `json:"localized_correct_answer,omitempty"`
}

type UpdateTaskDTO struct {
	Type          string            `json:"type,omitempty"`                        // Тип задачи
	Question      map[string]string `json:"question,omitempty"`                    // Локализованный вопрос
	CorrectAnswer string            `json:"correct_answer,omitempty"`              // Правильный ответ
	Hints         []string          `json:"hints,omitempty" validate:"min=2,dive"` // Подсказки или варианты ответа
	AudioPath     string            `json:"audio_path,omitempty"`                  // Путь к аудиофайлу
	ImagePath     string            `json:"image_path,omitempty"`                  // Путь к изображению
	Order         int               `json:"order,omitempty" validate:"gte=0"`      // Порядок выполнения задачи
}
