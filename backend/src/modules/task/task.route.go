package task

import "github.com/gin-gonic/gin"

func TaskRoutes(router *gin.RouterGroup, controller *TaskController) {
	taskGroup := router.Group("/tasks")

	taskGroup.POST("", controller.CreateTask)                        // Создание задачи
	taskGroup.GET("/unit/:unitID", controller.GetTasksByUnitID)      // Получение задач по UnitID
	taskGroup.GET("/unit/:unitID/next-task", controller.GetNextTask) // Получение следующего задания
	taskGroup.POST("/:taskID/check-answer", controller.CheckAnswer)  // Проверка ответа
	taskGroup.PUT("/:taskID", controller.UpdateTask)                 // Обновление задачи
	taskGroup.DELETE("/:taskID", controller.DeleteTask)              // Удаление задачи
}
