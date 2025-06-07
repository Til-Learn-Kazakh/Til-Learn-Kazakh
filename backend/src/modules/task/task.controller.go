package task

import (
	"diploma/src/modules/user"
	"diploma/src/services"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"mime/multipart"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type TaskController struct {
	Service     *TaskService
	UserService *user.UserService
}

func NewTaskController(service *TaskService, userService *user.UserService) *TaskController {
	return &TaskController{
		Service:     service,
		UserService: userService,
	}
}

func (ctrl *TaskController) CreateTask(c *gin.Context) {
	log.Println("CreateTask called")

	dto, err := parseTaskRequest(c)
	if err != nil {
		log.Println("parseTaskRequest error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	imageFile, imageHeader, imageOptionsFiles, audioPath, err := handleFiles(c)
	if err != nil {
		log.Println("handleFiles error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	dto.AudioPath = audioPath

	log.Println("Calling Service.CreateTask...")
	task, err := ctrl.Service.CreateTask(dto, imageFile, imageHeader, imageOptionsFiles)
	if err != nil {
		log.Println("Service.CreateTask error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create task"})
		return
	}

	log.Println("Task created successfully:", task.ID.Hex())
	c.JSON(http.StatusCreated, task)
}

func parseTaskRequest(c *gin.Context) (*CreateTaskDTO, error) {
	log.Println("Parsing task request...")

	unitID := c.PostForm("unit_id")
	taskType := c.PostForm("type")

	log.Printf("unit_id: %s, type: %s", unitID, taskType)

	var sentence []string
	if err := parseJSON(c.PostForm("sentence"), &sentence); err != nil {
		log.Println("Invalid sentence:", err)
		return nil, fmt.Errorf("invalid sentence format")
	}

	var question map[string]string
	if err := parseJSON(c.PostForm("question"), &question); err != nil {
		log.Println("Invalid question:", err)
		return nil, fmt.Errorf("invalid question format")
	}

	var description map[string]string
	if err := parseJSON(c.PostForm("description"), &description); err != nil {
		log.Println("Invalid description:", err)
		return nil, fmt.Errorf("invalid description format")
	}

	var highlightedword map[string]string
	if err := parseJSON(c.PostForm("highlighted_word"), &highlightedword); err != nil {
		log.Println("Invalid highlighted_word:", err)
		return nil, fmt.Errorf("invalid highlighted_word format")
	}

	var hints []string
	if err := parseJSON(c.PostForm("hints"), &hints); err != nil {
		log.Println("Invalid hints:", err)
		return nil, fmt.Errorf("invalid hints format")
	}

	var imageOptions []ImageOption
	if err := parseJSON(c.PostForm("image_options"), &imageOptions); err != nil {
		log.Println("Invalid image_options:", err)
		return nil, fmt.Errorf("invalid image_options format")
	}

	correctAnswer := c.PostForm("correct_answer")
	orderStr := c.PostForm("order")
	log.Printf("correct_answer: %s, order: %s", correctAnswer, orderStr)

	order, err := strconv.Atoi(orderStr)
	if err != nil {
		log.Println("Invalid order value:", err)
		return nil, fmt.Errorf("invalid order value")
	}

	var localizedHints map[string][]string
	if err := parseJSON(c.PostForm("localized_hints"), &localizedHints); err != nil {
		log.Println("Invalid localized_hints:", err)
		return nil, fmt.Errorf("invalid localized_hints format")
	}

	var localizedCorrectAnswer map[string]string
	if err := parseJSON(c.PostForm("localized_correct_answer"), &localizedCorrectAnswer); err != nil {
		log.Println("Invalid localized_correct_answer:", err)
		return nil, fmt.Errorf("invalid localized_correct_answer format")
	}

	log.Println("Successfully parsed task request.")

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
	log.Println("Handling uploaded files...")

	imageFile, imageHeader, err = c.Request.FormFile("image")
	if err != nil {
		if errors.Is(err, http.ErrMissingFile) {
			log.Println("No image file provided.")
			imageFile, imageHeader = nil, nil
		} else {
			log.Println("Error reading image file:", err)
			return nil, nil, nil, "", fmt.Errorf("failed to read image file: %w", err)
		}
	} else {
		log.Println("Image file received:", imageHeader.Filename)
	}

	form, err := c.MultipartForm()
	if err != nil && !errors.Is(err, http.ErrMissingFile) {
		log.Println("Error reading multipart form:", err)
		return nil, nil, nil, "", fmt.Errorf("failed to read multipart form: %w", err)
	}
	if form != nil && form.File != nil {
		imageOptionsFiles = form.File["image_options_files"]
		log.Printf("Found %d image options files", len(imageOptionsFiles))
	}

	audioFile, audioHeader, err := c.Request.FormFile("audio")
	if err != nil && !errors.Is(err, http.ErrMissingFile) {
		log.Println("Error reading audio file:", err)
		return nil, nil, nil, "", fmt.Errorf("failed to read audio file: %w", err)
	}

	if audioFile != nil && audioHeader != nil {
		log.Println("Saving audio file...")
		audioService := services.NewAudioService()
		audioPath, err = audioService.SaveAudio("voice", audioFile, audioHeader)
		if err != nil {
			log.Println("Failed to save audio file:", err)
			return nil, nil, nil, "", fmt.Errorf("failed to save audio: %w", err)
		}
		log.Println("Audio saved at:", audioPath)
	}

	log.Println("File handling completed.")
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

	userID, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
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

		oid, _ := primitive.ObjectIDFromHex(userID.(string))
		err = ctrl.UserService.DecreaseUserHeart(oid)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update hearts"})
			return
		}
	}

	c.JSON(http.StatusOK, response)
}

func (ctrl *TaskController) GetAllTasks(c *gin.Context) {
	tasks, err := ctrl.Service.GetAllTasks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get tasks", "details": err.Error()})
		return
	}

	c.JSON(http.StatusOK, tasks)
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
