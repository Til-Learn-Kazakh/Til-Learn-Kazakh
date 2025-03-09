package user

type UpdateXPRequest struct {
	UnitID        string  `json:"unitId" binding:"required"`
	Accuracy      float64 `json:"accuracy"`
	CommittedTime int     `json:"committedTime"`
	Mistakes      int     `json:"mistakes"`
	Combo         int     `json:"combo"`
}
