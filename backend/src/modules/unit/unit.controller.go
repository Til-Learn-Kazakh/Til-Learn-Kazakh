package unit

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UnitController struct {
	Service *UnitService
}

// Конструктор для UnitController
func NewUnitController(service *UnitService) *UnitController {
	return &UnitController{
		Service: service,
	}
}

// Создание нового блока
func (ctrl *UnitController) CreateUnit(c *gin.Context) {
	var dto CreateUnitDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data", "details": err.Error()})
		return
	}

	unit, err := ctrl.Service.CreateUnit(dto)
	if err != nil {
		if err.Error() == "level not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Level not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create unit", "details": err.Error()})
		}
		return
	}

	c.JSON(http.StatusCreated, unit)
}

// Получение всех блоков по LevelID
func (ctrl *UnitController) GetUnitsByLevelID(c *gin.Context) {
	levelIDHex := c.Param("levelID")
	levelID, err := primitive.ObjectIDFromHex(levelIDHex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid level ID"})
		return
	}

	units, err := ctrl.Service.GetUnitsByLevelID(levelID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch units", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, units)
}

// Обновление блока
func (ctrl *UnitController) UpdateUnit(c *gin.Context) {
	unitIDHex := c.Param("unitID")
	unitID, err := primitive.ObjectIDFromHex(unitIDHex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid unit ID"})
		return
	}

	var dto UpdateUnitDTO
	if err = c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input data", "details": err.Error()})
		return
	}

	unit, err := ctrl.Service.UpdateUnit(unitID, dto)
	if err != nil {
		if err.Error() == "unit not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Unit not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update unit", "details": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, unit)
}

// Удаление блока
func (ctrl *UnitController) DeleteUnit(c *gin.Context) {
	unitIDHex := c.Param("unitID")
	unitID, err := primitive.ObjectIDFromHex(unitIDHex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid unit ID"})
		return
	}

	err = ctrl.Service.DeleteUnit(unitID)
	if err != nil {
		if err.Error() == "unit not found" {
			c.JSON(http.StatusNotFound, gin.H{"error": "Unit not found"})
		} else {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete unit", "details": err.Error()})
		}
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Unit deleted successfully"})
}
