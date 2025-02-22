package task

import (
	"diploma/src/services"
	"encoding/json"
	"log"
	"mime/multipart"
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
	log.Println("Received request to create task")

	// Читаем unit_id и type из form-data
	unitID := c.PostForm("unit_id")
	taskType := c.PostForm("type")
	sentenceJSON := c.PostForm("sentence")
	var sentence []string
	if sentenceJSON != "" { // ✅ Проверяем, есть ли значение
		if err := json.Unmarshal([]byte(sentenceJSON), &sentence); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid sentence format"})
			return
		}
	}

	// Читаем question как JSON
	questionJSON := c.PostForm("question")
	var question map[string]string
	if err := json.Unmarshal([]byte(questionJSON), &question); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid question format"})
		return
	}

	descriptionJSON := c.PostForm("description")
	var description map[string]string

	if descriptionJSON != "" { // ✅ Проверяем, есть ли значение
		if err := json.Unmarshal([]byte(descriptionJSON), &description); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid description format"})
			return
		}
	}

	highlightedwordJSON := c.PostForm("highlighted_word")
	var highlightedword map[string]string

	if highlightedwordJSON != "" { // ✅ Проверка на пустоту
		if err := json.Unmarshal([]byte(highlightedwordJSON), &highlightedword); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid highlightedword format"})
			return
		}
	}

	// Читаем hints как JSON-массив
	hintsJSON := c.PostForm("hints")
	var hints []string

	if hintsJSON != "" { // ✅ Проверка на пустоту
		if err := json.Unmarshal([]byte(hintsJSON), &hints); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid hints format"})
			return
		}
	}

	imageOptionsJSON := c.PostForm("image_options")
	var imageOptions []ImageOption
	if imageOptionsJSON != "" {
		if err := json.Unmarshal([]byte(imageOptionsJSON), &imageOptions); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid image_options format"})
			return
		}
	}

	// Читаем остальные параметры
	correctAnswer := c.PostForm("correct_answer")
	orderStr := c.PostForm("order")

	// Преобразуем order в int
	order, err := strconv.Atoi(orderStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid order value"})
		return
	}

	imageFile, imageHeader, err := c.Request.FormFile("image")

	// ✅ Читаем несколько файлов для image_options_files
	form, err := c.MultipartForm()
	if err != nil && err != http.ErrMissingFile {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read multipart form"})
		return
	}
	imageOptionsFiles := []*multipart.FileHeader{}
	if form != nil && form.File != nil {
		imageOptionsFiles = form.File["image_options_files"]
	}

	audioFile, audioHeader, err := c.Request.FormFile("audio")
	if err != nil && err != http.ErrMissingFile {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read audio file"})
		return
	}

	// Если аудиофайл передан, сохраняем его
	var audioPath string
	if audioFile != nil && audioHeader != nil {
		audioService := services.NewAudioService()
		audioPath, err = audioService.SaveAudio("voice", audioFile, audioHeader)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save audio"})
			return
		}
	} else {
		// Аудиофайл не передан — оставляем путь пустым или обрабатываем как optional
		audioPath = ""
	}

	localizedHintsJSON := c.PostForm("localized_hints")
	var localizedHints map[string][]string
	if localizedHintsJSON != "" {
		if err := json.Unmarshal([]byte(localizedHintsJSON), &localizedHints); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid localized_hints format"})
			return
		}
	}

	localizedCorrectAnswerJSON := c.PostForm("localized_correct_answer")
	var localizedCorrectAnswer map[string]string
	if localizedCorrectAnswerJSON != "" {
		if err := json.Unmarshal([]byte(localizedCorrectAnswerJSON), &localizedCorrectAnswer); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid localized_correct_answer format"})
			return
		}
	}

	dto := &CreateTaskDTO{
		UnitID:                 unitID,
		Type:                   taskType,
		Question:               question,
		CorrectAnswer:          correctAnswer,
		Hints:                  hints,
		Sentence:               sentence,
		AudioPath:              audioPath,
		Order:                  order,
		HighlightedWord:        highlightedword,
		Description:            description,
		ImageOptions:           imageOptions,
		LocalizedHints:         localizedHints,
		LocalizedCorrectAnswer: localizedCorrectAnswer,
	}

	task, err := ctrl.Service.CreateTask(dto, imageFile, imageHeader, imageOptionsFiles)
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
		UserLang   string `json:"user_lang"` // ✅ новое поле для языка
	}
	if err := c.ShouldBindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	isCorrect, correctAnswer, err := ctrl.Service.CheckAnswer(taskID, requestBody.UserAnswer, requestBody.UserLang)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	response := gin.H{"is_correct": isCorrect}
	if !isCorrect {
		response["correct_answer"] = correctAnswer
	}

	c.JSON(http.StatusOK, response)
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
