package level

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type LevelController struct {
	Service *LevelService
}

// Конструктор для LevelController
func NewLevelController(service *LevelService) *LevelController {
	return &LevelController{
		Service: service,
	}
}

// Создание нового уровня
func (ctrl *LevelController) CreateLevel(c *gin.Context) {
	var dto CreateLevelDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	level, err := ctrl.Service.CreateLevel(dto)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create level"})
		return
	}

	c.JSON(http.StatusCreated, level)
}

// Получение всех уровней
func (ctrl *LevelController) GetAllLevels(c *gin.Context) {
	levels, err := ctrl.Service.GetAllLevels()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch levels"})
		return
	}

	c.JSON(http.StatusOK, levels)
}

// Удаление уровня
func (ctrl *LevelController) DeleteLevel(c *gin.Context) {
	levelID := c.Param("levelID")
	objectID, err := primitive.ObjectIDFromHex(levelID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid level ID"})
		return
	}

	err = ctrl.Service.DeleteLevel(objectID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete level"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Level and related units deleted successfully"})
}
