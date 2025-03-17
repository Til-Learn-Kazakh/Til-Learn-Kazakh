package analytics

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type AnalyticsController struct {
	analyticsService *AnalyticsService
}

func NewAnalyticsController(analyticsService *AnalyticsService) *AnalyticsController {
	return &AnalyticsController{analyticsService: analyticsService}
}

// Helper function to extract user ID from context
func (*AnalyticsController) getUserID(c *gin.Context) (string, bool) {
	userID, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return "", false
	}
	userIDStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return "", false
	}
	return userIDStr, true
}

// Generic handler for fetching analytics stats
func (ac *AnalyticsController) getStats(c *gin.Context, paramName string, fetchFunc func(userID, param string) (any, error)) {
	userID, valid := ac.getUserID(c)
	if !valid {
		return
	}

	param := c.Query(paramName)
	if param == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing " + paramName + " query param"})
		return
	}

	stats, err := fetchFunc(userID, param)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}

// Adapter functions to match the expected function signature
func (ac *AnalyticsController) getDailyStatAdapter(userID, dateStr string) (any, error) {
	return ac.analyticsService.GetDailyStat(userID, dateStr)
}

func (ac *AnalyticsController) getMonthlyStatAdapter(userID, monthID string) (any, error) {
	return ac.analyticsService.GetMonthlyStat(userID, monthID)
}

func (ac *AnalyticsController) getYearlyStatAdapter(userID, yearID string) (any, error) {
	return ac.analyticsService.GetYearlyStat(userID, yearID)
}

// 1. Получение всей статистики пользователя
func (ac *AnalyticsController) GetUserStatisticsHandler(c *gin.Context) {
	userID, valid := ac.getUserID(c)
	if !valid {
		return
	}

	stats, err := ac.analyticsService.GetUserStatistics(userID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}

// 2. Получение статистики за день
// GET /api/analytics/daily?date=2025-03-12
func (ac *AnalyticsController) GetDailyStatHandler(c *gin.Context) {
	ac.getStats(c, "date", ac.getDailyStatAdapter)
}

// 3. Получение статистики за месяц
// GET /api/analytics/monthly?month=2025-3
func (ac *AnalyticsController) GetMonthlyStatHandler(c *gin.Context) {
	ac.getStats(c, "month", ac.getMonthlyStatAdapter)
}

// 4. Получение статистики за год
// GET /api/analytics/yearly?year=2025
func (ac *AnalyticsController) GetYearlyStatHandler(c *gin.Context) {
	ac.getStats(c, "year", ac.getYearlyStatAdapter)
}
