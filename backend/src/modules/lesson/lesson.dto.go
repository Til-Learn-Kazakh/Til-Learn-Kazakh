package lesson

type CreateLessonDTO struct {
	Name string `form:"name" json:"name" validate:"required"`
	Icon string `json:"icon"`
}

type UpdateLessonDTO struct {
	Name string `form:"name" json:"name,omitempty"`
	Icon string `json:"icon,omitempty"`
}
