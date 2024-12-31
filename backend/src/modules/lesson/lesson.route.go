package lesson

import "github.com/gin-gonic/gin"

func LessonRoutes(router *gin.RouterGroup, controller *LessonController) {
	lessonGroup := router.Group("/lessons")

	lessonGroup.POST("/", controller.CreateLesson)            // Создание урока
	lessonGroup.GET("/", controller.GetAllLessons)            // Получение всех уроков
	lessonGroup.GET("/:lessonID", controller.GetLessonByID)   // Получение урока по ID
	lessonGroup.PUT("/:lessonID", controller.UpdateLesson)    // Обновление урока
	lessonGroup.DELETE("/:lessonID", controller.DeleteLesson) // Удаление урока
}
