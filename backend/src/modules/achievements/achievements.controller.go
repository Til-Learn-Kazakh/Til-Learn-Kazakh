package achievements

import (
	"diploma/src/modules/auth"
	"diploma/src/services"
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// AchievementsController - контроллер для работы с достижениями
type AchievementsController struct {
	Service *AchievementsService
}

// NewAchievementsController - создание нового контроллера достижений
func NewAchievementsController(service *AchievementsService) *AchievementsController {
	return &AchievementsController{Service: service}
}

// GetAllAchievementsHandler - возвращает все доступные достижения
func (c *AchievementsController) GetAllAchievementsHandler(ctx *gin.Context) {
	achievements, err := c.Service.GetAllAchievements(ctx)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, achievements)
}

// GetUserAchievementsProgressHandler - возвращает достижения с прогрессом пользователя
func (c *AchievementsController) GetUserAchievementsProgressHandler(ctx *gin.Context) {
	// Получаем userID из контекста
	userID, exists := ctx.Get("uid")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Преобразуем userID в ObjectID
	userObjectID, err := primitive.ObjectIDFromHex(userID.(string))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	// Получаем пользователя
	var user auth.User
	err = c.Service.UserCollection.FindOne(ctx, bson.M{"_id": userObjectID}).Decode(&user)
	if err != nil {
		ctx.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Получаем прогресс достижений
	progressList, err := c.Service.GetUserAchievementsProgress(ctx, &user)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, progressList)
}

// CreateAchievementHandler - создаёт новое достижение
func (c *AchievementsController) CreateAchievementHandler(ctx *gin.Context) {
	achievement, err := parseAndValidateAchievementForm(ctx)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	created, err := c.Service.CreateAchievement(ctx, achievement)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, created)
}

func parseAndValidateAchievementForm(ctx *gin.Context) (*Achievement, error) {
	title := ctx.PostForm("title")
	description := ctx.PostForm("description")
	achievementType := ctx.PostForm("type")
	thresholdStr := ctx.PostForm("threshold")
	rewardStr := ctx.PostForm("reward")

	if title == "" || description == "" || achievementType == "" || thresholdStr == "" || rewardStr == "" {
		return nil, errors.New("Missing required fields")
	}

	threshold, err := strconv.Atoi(thresholdStr)
	if err != nil || threshold <= 0 {
		return nil, errors.New("Invalid threshold value")
	}

	reward, err := strconv.Atoi(rewardStr)
	if err != nil || reward <= 0 {
		return nil, errors.New("Invalid reward value")
	}

	imagePath, err := handleAchievementImageUpload(ctx)
	if err != nil {
		return nil, err
	}

	return &Achievement{
		ID:          primitive.NewObjectID(),
		Title:       title,
		Description: description,
		Type:        AchievementType(achievementType),
		Threshold:   threshold,
		Reward:      reward,
		ImagePath:   imagePath,
		CreatedAt:   time.Now(),
		UpdatedAt:   time.Now(),
	}, nil
}

func handleAchievementImageUpload(ctx *gin.Context) (string, error) {
	imageFile, imageHeader, err := ctx.Request.FormFile("image")
	if err != nil && !errors.Is(err, http.ErrMissingFile) {
		return "", errors.New("Invalid image file")
	}

	if imageFile == nil || imageHeader == nil {
		return "", errors.New("Image file is required")
	}

	imageService := services.NewImageService()
	imagePath, err := imageService.SaveImage("achievements", imageFile, imageHeader)
	if err != nil {
		return "", fmt.Errorf("Failed to save image: %w", err)
	}

	return imagePath, nil
}

// UpdateAchievementHandler - обновляет достижение
func (c *AchievementsController) UpdateAchievementHandler(ctx *gin.Context) {
	achievementHex := ctx.Param("achievementID")
	achievementID, err := primitive.ObjectIDFromHex(achievementHex)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid achievement ID"})
		return
	}

	var updateData map[string]any
	if bindErr := ctx.ShouldBindJSON(&updateData); bindErr != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
		return
	}

	err = c.Service.UpdateAchievement(ctx, achievementID, updateData)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"message": "Achievement updated"})
}

// GrantAchievementHandler - выдаёт достижение пользователю
func (c *AchievementsController) ClaimAchievementReward(ctx *gin.Context) {
	// Получаем userID из контекста
	userID, exists := ctx.Get("uid")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	// Преобразуем userID в ObjectID
	userObjectID, err := primitive.ObjectIDFromHex(userID.(string))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid user ID"})
		return
	}

	achievementIDHex := ctx.Param("achievementID")
	achievementID, err := primitive.ObjectIDFromHex(achievementIDHex)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Invalid achievement ID"})
		return
	}

	err = c.Service.ClaimAchievementReward(ctx, userObjectID, achievementID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to claim reward"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{"message": "Reward claimed successfully"})
}
