package analytics

import (
	"github.com/gin-gonic/gin"
)

func AnalyticsRoutes(router *gin.RouterGroup, analyticsController *AnalyticsController) {
	analyticsGroup := router.Group("/analytics")

	analyticsGroup.GET("", analyticsController.GetUserStatisticsHandler)      // Получение streak пользователя
	analyticsGroup.GET("/daily", analyticsController.GetDailyStatHandler)     // Сброс streak
	analyticsGroup.GET("/monthly", analyticsController.GetMonthlyStatHandler) // Сброс streak
	analyticsGroup.GET("/yearly", analyticsController.GetYearlyStatHandler)   // Сброс streak

}
