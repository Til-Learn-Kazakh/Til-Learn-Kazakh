package task

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TaskController struct {
	Service *TaskService
}

// Конструктор для TaskController
func NewTaskController(service *TaskService) *TaskController {
	return &TaskController{
		Service: service,
	}
}

// Создание новой задачи
func (ctrl *TaskController) CreateTask(c *gin.Context) {
	var dto CreateTaskDTO
	if err := c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task, err := ctrl.Service.CreateTask(&dto)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	c.JSON(http.StatusCreated, task)
}

// Получение всех задач по UnitID
func (ctrl *TaskController) GetTasksByUnitID(c *gin.Context) {
	unitIDHex := c.Param("unitID")
	unitID, err := primitive.ObjectIDFromHex(unitIDHex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid unit ID"})
		return
	}

	tasks, err := ctrl.Service.GetTasksByUnitID(unitID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch tasks"})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

func (ctrl *TaskController) GetNextTask(c *gin.Context) {
	unitIDHex := c.Param("unitID")
	unitID, err := primitive.ObjectIDFromHex(unitIDHex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Unit ID"})
		return
	}

	currentOrder := 0 // По умолчанию начинаем с первого задания
	if order := c.Query("currentOrder"); order != "" {
		currentOrder, err = strconv.Atoi(order)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid current order"})
			return
		}
	}

	// Вызываем сервисный метод с корректными типами
	nextTask, err := ctrl.Service.GetNextTask(unitID, currentOrder)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, nextTask)
}

func (ctrl *TaskController) CheckAnswer(c *gin.Context) {
	taskIDHex := c.Param("taskID")
	taskID, err := primitive.ObjectIDFromHex(taskIDHex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Task ID"})
		return
	}

	var requestBody struct {
		UserAnswer string `json:"user_answer" binding:"required"`
	}
	if err = c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	isCorrect, err := ctrl.Service.CheckAnswer(taskID, requestBody.UserAnswer)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"is_correct": isCorrect})
}

// Обновление задачи
func (ctrl *TaskController) UpdateTask(c *gin.Context) {
	taskIDHex := c.Param("taskID")
	taskID, err := primitive.ObjectIDFromHex(taskIDHex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	var dto UpdateTaskDTO
	if err = c.ShouldBindJSON(&dto); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	task, err := ctrl.Service.UpdateTask(taskID, &dto)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update task"})
		return
	}

	c.JSON(http.StatusOK, task)
}

// Удаление задачи
func (ctrl *TaskController) DeleteTask(c *gin.Context) {
	taskIDHex := c.Param("taskID")
	taskID, err := primitive.ObjectIDFromHex(taskIDHex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid task ID"})
		return
	}

	err = ctrl.Service.DeleteTask(taskID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete task"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
}
