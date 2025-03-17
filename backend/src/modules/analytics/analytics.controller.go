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

// 1. Получение всей статистики пользователя
func (ac *AnalyticsController) GetUserStatisticsHandler(c *gin.Context) {
	userID, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	stats, err := ac.analyticsService.GetUserStatistics(userIDStr)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, stats)
}

// 2. Получение статистики за день
// GET /api/analytics/daily?date=2025-03-12
func (ac *AnalyticsController) GetDailyStatHandler(c *gin.Context) {
	userID, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}
	dateStr := c.Query("date")
	if dateStr == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing date query param"})
		return
	}

	daily, err := ac.analyticsService.GetDailyStat(userIDStr, dateStr)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, daily)
}

// 3. Получение статистики за месяц
// GET /api/analytics/monthly?month=2025-3
func (ac *AnalyticsController) GetMonthlyStatHandler(c *gin.Context) {
	userID, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}
	monthID := c.Query("month")
	if monthID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing month query param"})
		return
	}

	monthly, err := ac.analyticsService.GetMonthlyStat(userIDStr, monthID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, monthly)
}

// 4. Получение статистики за год
// GET /api/analytics/yearly?year=2025
func (ac *AnalyticsController) GetYearlyStatHandler(c *gin.Context) {
	userID, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	userIDStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}
	yearID := c.Query("year")
	if yearID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing year query param"})
		return
	}

	yearly, err := ac.analyticsService.GetYearlyStat(userIDStr, yearID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, yearly)
}
