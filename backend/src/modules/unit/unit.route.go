package unit

import "github.com/gin-gonic/gin"

func UnitRoutes(router *gin.RouterGroup, controller *UnitController) {
	unitGroup := router.Group("/units")

	unitGroup.POST("/", controller.CreateUnit)                        // Создание нового блока
	unitGroup.GET("/by-level/:levelID", controller.GetUnitsByLevelID) // Получение всех блоков по LevelID
	unitGroup.PUT("/:unitID", controller.UpdateUnit)                  // Обновление блока
	unitGroup.DELETE("/:unitID", controller.DeleteUnit)               // Удаление блока
}
