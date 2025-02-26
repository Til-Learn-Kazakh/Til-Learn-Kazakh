package auth

import (
	"github.com/gin-gonic/gin"
)

func AuthRoutes(incomingRoutes *gin.RouterGroup, controller *AuthController) {
	authGroup := incomingRoutes.Group("/auth")
	authGroup.POST("/login", controller.LoginHandler)          // Привязка к LoginHandler
	authGroup.POST("/register", controller.SignUpHandler)      // Привязка к SignUpHandler
	authGroup.POST("/refresh", controller.RefreshTokenHandler) // Привязка к RefreshTokenHandler
}
