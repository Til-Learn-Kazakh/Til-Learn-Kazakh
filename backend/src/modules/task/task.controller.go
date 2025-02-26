package task

import (
	"diploma/src/services"
	"encoding/json"
	"errors"
	"fmt"
	"mime/multipart"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TaskController struct {
	Service *TaskService
}

func NewTaskController(service *TaskService) *TaskController {
	return &TaskController{
		Service: service,
	}
}

func (ctrl *TaskController) CreateTask(c *gin.Context) {
	dto, err := parseTaskRequest(c)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	imageFile, imageHeader, imageOptionsFiles, audioPath, err := handleFiles(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	dto.AudioPath = audioPath

	task, err := ctrl.Service.CreateTask(dto, imageFile, imageHeader, imageOptionsFiles)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	c.JSON(http.StatusCreated, task)
}

func parseTaskRequest(c *gin.Context) (*CreateTaskDTO, error) {
	unitID := c.PostForm("unit_id")
	taskType := c.PostForm("type")

	var sentence []string
	if err := parseJSON(c.PostForm("sentence"), &sentence); err != nil {
		return nil, fmt.Errorf("invalid sentence format")
	}

	var question map[string]string
	if err := parseJSON(c.PostForm("question"), &question); err != nil {
		return nil, fmt.Errorf("invalid question format")
	}

	var description map[string]string
	if err := parseJSON(c.PostForm("description"), &description); err != nil {
		return nil, fmt.Errorf("invalid description format")
	}

	var highlightedword map[string]string
	if err := parseJSON(c.PostForm("highlighted_word"), &highlightedword); err != nil {
		return nil, fmt.Errorf("invalid highlighted_word format")
	}

	var hints []string
	if err := parseJSON(c.PostForm("hints"), &hints); err != nil {
		return nil, fmt.Errorf("invalid hints format")
	}

	var imageOptions []ImageOption
	if err := parseJSON(c.PostForm("image_options"), &imageOptions); err != nil {
		return nil, fmt.Errorf("invalid image_options format")
	}

	correctAnswer := c.PostForm("correct_answer")
	orderStr := c.PostForm("order")

	order, err := strconv.Atoi(orderStr)
	if err != nil {
		return nil, fmt.Errorf("invalid order value")
	}

	var localizedHints map[string][]string
	if err := parseJSON(c.PostForm("localized_hints"), &localizedHints); err != nil {
		return nil, fmt.Errorf("invalid localized_hints format")
	}

	var localizedCorrectAnswer map[string]string
	if err := parseJSON(c.PostForm("localized_correct_answer"), &localizedCorrectAnswer); err != nil {
		return nil, fmt.Errorf("invalid localized_correct_answer format")
	}

	return &CreateTaskDTO{
		UnitID:                 unitID,
		Type:                   taskType,
		Question:               question,
		CorrectAnswer:          correctAnswer,
		Hints:                  hints,
		Sentence:               sentence,
		Order:                  order,
		HighlightedWord:        highlightedword,
		Description:            description,
		ImageOptions:           imageOptions,
		LocalizedHints:         localizedHints,
		LocalizedCorrectAnswer: localizedCorrectAnswer,
	}, nil
}

func parseJSON(data string, v any) error {
	if data == "" {
		return nil
	}
	return json.Unmarshal([]byte(data), v)
}

func handleFiles(c *gin.Context) (imageFile multipart.File, imageHeader *multipart.FileHeader, imageOptionsFiles []*multipart.FileHeader, audioPath string, err error) {
	// Handle image file
	imageFile, imageHeader, err = c.Request.FormFile("image")
	if err != nil && !errors.Is(err, http.ErrMissingFile) {
		return nil, nil, nil, "", fmt.Errorf("failed to read image file: %w", err)
	}
	if errors.Is(err, http.ErrMissingFile) {
		imageFile, imageHeader = nil, nil
	}

	form, err := c.MultipartForm()
	if err != nil && !errors.Is(err, http.ErrMissingFile) {
		return nil, nil, nil, "", fmt.Errorf("failed to read multipart form: %w", err)
	}
	if form != nil && form.File != nil {
		imageOptionsFiles = form.File["image_options_files"]
	} else {
		imageOptionsFiles = nil
	}

	audioFile, audioHeader, err := c.Request.FormFile("audio")
	if err != nil && !errors.Is(err, http.ErrMissingFile) {
		return nil, nil, nil, "", fmt.Errorf("failed to read audio file: %w", err)
	}
	if errors.Is(err, http.ErrMissingFile) {
		audioFile, audioHeader = nil, nil
	}

	if audioFile != nil && audioHeader != nil {
		audioService := services.NewAudioService()
		audioPath, err = audioService.SaveAudio("voice", audioFile, audioHeader)
		if err != nil {
			return nil, nil, nil, "", fmt.Errorf("failed to save audio: %w", err)
		}
	} else {
		audioPath = ""
	}

	return imageFile, imageHeader, imageOptionsFiles, audioPath, nil
}

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

	currentOrder := 0
	if order := c.Query("currentOrder"); order != "" {
		currentOrder, err = strconv.Atoi(order)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid current order"})
			return
		}
	}

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
		UserLang   string `json:"user_lang"`
	}
	if err = c.ShouldBindJSON(&requestBody); err != nil {
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
