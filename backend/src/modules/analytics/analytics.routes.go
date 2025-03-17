package analytics

import (
	"github.com/gin-gonic/gin"
)

func AnalyticsRoutes(router *gin.RouterGroup, analyticsController *AnalyticsController) {
	analyticsGroup := router.Group("/analytics")
	analyticsGroup.GET("", analyticsController.GetUserStatisticsHandler)
	analyticsGroup.GET("/daily", analyticsController.GetDailyStatHandler)
	analyticsGroup.GET("/monthly", analyticsController.GetMonthlyStatHandler)
	analyticsGroup.GET("/yearly", analyticsController.GetYearlyStatHandler)
}
