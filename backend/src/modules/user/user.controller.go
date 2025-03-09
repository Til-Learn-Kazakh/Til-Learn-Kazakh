package user

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserController struct {
	Service *UserService
}

func NewUserController(service *UserService) *UserController {
	return &UserController{
		Service: service,
	}
}

func (ctrl *UserController) GetCurrentUser(c *gin.Context) {
	userID, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	user, err := ctrl.Service.GetUserByID(userID.(string))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (ctrl *UserController) RefillHeartsWithCrystals(c *gin.Context) {
	userID, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	user, err := ctrl.Service.RefillHeartsWithCrystals(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (ctrl *UserController) RefillHearts(c *gin.Context) {
	userID, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	user, err := ctrl.Service.RefillHearts(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, user)
}

func (ctrl *UserController) DecreaseUserHeart(c *gin.Context) {
	userID, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	oid, err := primitive.ObjectIDFromHex(userID.(string))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid User ID"})
		return
	}

	err = ctrl.Service.DecreaseUserHeart(oid)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Heart decreased"})
}

func (ctrl *UserController) UpdateXP(c *gin.Context) {
	userID, exists := c.Get("uid")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}

	var request UpdateXPRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, unitXP, err := ctrl.Service.UpdateXP(userID.(string), request.UnitID, request.Accuracy, request.CommittedTime, request.Mistakes, request.Combo)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"xpEarned": unitXP,
		"totalXP":  user.XP,
		"message":  "XP updated successfully",
	})
}
