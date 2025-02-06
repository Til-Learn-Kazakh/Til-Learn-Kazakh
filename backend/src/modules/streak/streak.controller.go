package streak

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type StreakController struct {
	streakService *StreakService
}

func NewStreakController(streakService *StreakService) *StreakController {
	return &StreakController{streakService: streakService}
}

// 2️⃣ Получение streak по `uid` (из токена, без `/:userId`)
func (sc *StreakController) GetUserStreak(c *gin.Context) {
	userID, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	userIDStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID"})
		return
	}

	streak, err := sc.streakService.GetUserStreak(userIDStr)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Streak not found"})
		return
	}

	c.JSON(http.StatusOK, streak)
}

func handleStreak(c *gin.Context, req any, serviceFunc func(any) error, successMessage string) {
	if err := c.ShouldBindJSON(req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := serviceFunc(req); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": successMessage})
}

// 1️⃣ Обновление streak при завершении урока
func (sc *StreakController) UpdateStreak(c *gin.Context) {
	var req UpdateStreakDTO
	handleStreak(c, &req, func(data any) error {
		return sc.streakService.UpdateStreak(data.(UpdateStreakDTO))
	}, "Streak updated")
}

// 2️⃣ Сброс streak
func (sc *StreakController) ResetStreak(c *gin.Context) {
	var req ResetStreakDTO
	handleStreak(c, &req, func(data any) error {
		return sc.streakService.ResetStreak(data.(ResetStreakDTO))
	}, "Streak reset")
}
