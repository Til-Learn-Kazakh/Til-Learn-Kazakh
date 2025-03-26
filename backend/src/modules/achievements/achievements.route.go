package achievements

import (
	"github.com/gin-gonic/gin"
)

func AchievementsRoutes(incomingRoutes *gin.RouterGroup, controller *AchievementsController) {
	achievementsGroup := incomingRoutes.Group("/achievements")

	achievementsGroup.GET("", controller.GetAllAchievementsHandler)                    // Получить все достижения
	achievementsGroup.GET("/progress", controller.GetUserAchievementsProgressHandler)  // Прогресс достижений пользователя
	achievementsGroup.POST("", controller.CreateAchievementHandler)                    // Создать достижение
	achievementsGroup.PUT("/:achievementID", controller.UpdateAchievementHandler)      // Обновить достижение
	achievementsGroup.POST("/claim/:achievementID", controller.ClaimAchievementReward) // Выдать достижение пользователю
}
