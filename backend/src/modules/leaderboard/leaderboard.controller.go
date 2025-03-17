package leaderboard

import (
	"context"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type LeaderboardController struct {
	Service *LeaderboardService
}

func NewLeaderboardController(service *LeaderboardService) *LeaderboardController {
	return &LeaderboardController{
		Service: service,
	}
}

// GET /leaderboard/weekly
func (lc *LeaderboardController) GetWeekly(c *gin.Context) {
	limitStr := c.Query("limit")
	if limitStr == "" {
		limitStr = "100"
	}
	limit, _ := strconv.ParseInt(limitStr, 10, 64)

	leaderboard, err := lc.Service.GetWeeklyLeaderboard(context.Background(), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, leaderboard)
}

// GET /leaderboard/monthly
func (lc *LeaderboardController) GetMonthly(c *gin.Context) {
	limitStr := c.Query("limit")
	if limitStr == "" {
		limitStr = "100"
	}
	limit, _ := strconv.ParseInt(limitStr, 10, 64)

	leaderboard, err := lc.Service.GetMonthlyLeaderboard(context.Background(), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, leaderboard)
}

// GET /leaderboard/all
func (lc *LeaderboardController) GetAllTime(c *gin.Context) {
	limitStr := c.Query("limit")
	if limitStr == "" {
		limitStr = "100"
	}
	limit, _ := strconv.ParseInt(limitStr, 10, 64)

	leaderboard, err := lc.Service.GetAllTimeLeaderboard(context.Background(), limit)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, leaderboard)
}
