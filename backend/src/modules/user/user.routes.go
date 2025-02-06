package user

import (
	"github.com/gin-gonic/gin"
)

func UserRoutes(router *gin.RouterGroup, controller *UserController) {
	userGroup := router.Group("/auth")
	userGroup.GET("/current", controller.GetCurrentUser)
	userGroup.POST("/refill-hearts", controller.RefillHearts)
	userGroup.POST("/refill-hearts-with-crystals", controller.RefillHeartsWithCrystals)
}
