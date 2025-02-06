package level

type CreateLevelDTO struct {
	Name string `form:"name" json:"name" validate:"required"`
}

type UpdateLevelDTO struct {
	Name string `form:"name" json:"name,omitempty"`
}
