package level

import "github.com/gin-gonic/gin"

func LevelRoutes(router *gin.RouterGroup, controller *LevelController) {
	levelGroup := router.Group("/levels")

	levelGroup.POST("/", controller.CreateLevel)           // Создание уровня
	levelGroup.GET("/", controller.GetAllLevels)           // Получение всех уровней
	levelGroup.DELETE("/:levelID", controller.DeleteLevel) // Удаление уровня
}
