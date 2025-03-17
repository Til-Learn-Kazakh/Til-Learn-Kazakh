package leaderboard

import (
	"github.com/gin-gonic/gin"
)

func LeaderboardRoutes(router *gin.RouterGroup, controller *LeaderboardController) {
	LeaderboardGroup := router.Group("/leaderboard")
	LeaderboardGroup.GET("/weekly", controller.GetWeekly)
	LeaderboardGroup.GET("/monthly", controller.GetMonthly)
	LeaderboardGroup.GET("/all", controller.GetAllTime)
}
