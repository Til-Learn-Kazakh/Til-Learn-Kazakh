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

// 1️⃣ Обновление streak при завершении урока
func (sc *StreakController) UpdateStreak(c *gin.Context) {
	var req UpdateStreakDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := sc.streakService.UpdateStreak(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Streak updated"})
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

// 3️⃣ Сброс streak
func (sc *StreakController) ResetStreak(c *gin.Context) {
	var req ResetStreakDTO
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := sc.streakService.ResetStreak(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Streak reset"})
}
