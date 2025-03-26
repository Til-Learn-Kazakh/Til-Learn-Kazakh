package user

type UpdateXPRequest struct {
	UnitID        string `json:"unitId" binding:"required"`
	Correct       int    `json:"correct"`
	Attempts      int    `json:"attempts"`
	CommittedTime int    `json:"committedTime"`
	Mistakes      int    `json:"mistakes"`
	Combo         int    `json:"combo"`
}

type UpdateUserDto struct {
	FirstName string `json:"first_name" validate:"required"`
	LastName  string `json:"last_name" validate:"required"`
	Email     string `json:"email" validate:"required,email"`
}

type ChangePasswordDto struct {
	OldPassword     string `json:"old_password" binding:"required"`
	NewPassword     string `json:"new_password" binding:"required,min=6"`
	ConfirmPassword string `json:"confirm_password" binding:"required,eqfield=NewPassword"`
}
