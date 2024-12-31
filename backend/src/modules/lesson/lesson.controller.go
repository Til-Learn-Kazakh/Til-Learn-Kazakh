package lesson

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type LessonController struct {
	Service *LessonService
}

// Создание нового урока
func (ctrl *LessonController) CreateLesson(c *gin.Context) {
	// Привязываем данные формы
	var dto CreateLessonDTO
	if err := c.ShouldBind(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Получаем файл
	file, fileHeader, err := c.Request.FormFile("icon")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to get icon file"})
		return
	}
	defer file.Close()

	// Передаем данные в сервис
	lesson, err := ctrl.Service.CreateLesson(dto, file, fileHeader)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create lesson"})
		return
	}

	c.JSON(http.StatusCreated, lesson)
}

// Получение всех уроков
func (ctrl *LessonController) GetAllLessons(c *gin.Context) {
	lessons, err := ctrl.Service.GetAllLessons()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch lessons"})
		return
	}

	c.JSON(http.StatusOK, lessons)
}

// Получение урока по ID
func (ctrl *LessonController) GetLessonByID(c *gin.Context) {
	lessonID := c.Param("lessonID")
	objectID, err := primitive.ObjectIDFromHex(lessonID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid lesson ID"})
		return
	}

	lesson, err := ctrl.Service.GetLessonByID(objectID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Lesson not found"})
		return
	}

	c.JSON(http.StatusOK, lesson)
}

// Обновление урока
func (ctrl *LessonController) UpdateLesson(c *gin.Context) {
	// Получаем ID урока из параметров
	lessonIDHex := c.Param("lessonID")
	lessonID, err := primitive.ObjectIDFromHex(lessonIDHex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid lesson ID"})
		return
	}

	// Получаем данные из формы
	var dto UpdateLessonDTO
	if err = c.ShouldBind(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Получаем файл (если предоставлен)
	file, fileHeader, _ := c.Request.FormFile("icon")
	if file != nil {
		defer file.Close()
	}

	// Обновляем урок
	lesson, err := ctrl.Service.UpdateLesson(lessonID, dto, file, fileHeader)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update lesson"})
		return
	}

	// Возвращаем обновленный урок
	c.JSON(http.StatusOK, lesson)
}

// Удаление урока
func (ctrl *LessonController) DeleteLesson(c *gin.Context) {
	lessonID := c.Param("lessonID")
	objectID, err := primitive.ObjectIDFromHex(lessonID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid lesson ID"})
		return
	}

	err = ctrl.Service.DeleteLesson(objectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete lesson"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Lesson deleted successfully"})
}
