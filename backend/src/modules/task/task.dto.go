package task

type CreateTaskDTO struct {
	UnitID        string            `json:"unit_id" validate:"required"`          // ID блока
	Type          string            `json:"type" validate:"required"`             // Тип задачи
	Question      map[string]string `json:"question" validate:"required"`         // Локализованный вопрос
	CorrectAnswer string            `json:"correct_answer" validate:"required"`   // Правильный ответ
	Hints         []string          `json:"hints" validate:"min=2,dive,required"` // Подсказки или варианты ответа
	AudioPath     string            `json:"audio_path,omitempty"`                 // Путь к аудиофайлу
	ImagePath     string            `json:"image_path,omitempty"`                 // Путь к изображению
	Order         int               `json:"order" validate:"gte=0"`               // Порядок выполнения задачи
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
