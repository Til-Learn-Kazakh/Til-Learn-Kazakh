package analytics

type MonthlyStatResponse struct {
	MonthlyStats MonthlyStats       `json:"monthStats"`
	DayStats     map[int]DailyStats `json:"dayStats"`
}
