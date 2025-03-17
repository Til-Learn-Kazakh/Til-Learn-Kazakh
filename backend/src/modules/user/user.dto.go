package user

type UpdateXPRequest struct {
	UnitID        string `json:"unitId" binding:"required"`
	Correct       int    `json:"correct"`
	Attempts      int    `json:"attempts"`
	CommittedTime int    `json:"committedTime"`
	Mistakes      int    `json:"mistakes"`
	Combo         int    `json:"combo"`
}
