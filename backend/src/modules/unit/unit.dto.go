package unit

type CreateUnitDTO struct {
	Title   string `json:"title" validate:"required"`    // Название блока
	LevelID string `json:"level_id" validate:"required"` // ID уровня, к которому привязан блок
}

type UpdateUnitDTO struct {
	Title string `json:"title,omitempty" validate:"omitempty"` // Обновленное название блока
}
