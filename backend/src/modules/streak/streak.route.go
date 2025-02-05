package streak

import (
	"github.com/gin-gonic/gin"
)

func StreakRoutes(router *gin.RouterGroup, streakController *StreakController) {
	streakGroup := router.Group("/streak")

	streakGroup.PUT("/", streakController.UpdateStreak)   // Обновление streak (вызывается при завершении урока)
	streakGroup.GET("", streakController.GetUserStreak)  // Получение streak пользователя
	streakGroup.DELETE("/", streakController.ResetStreak) // Сброс streak

}
