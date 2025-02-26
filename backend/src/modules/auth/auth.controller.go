package auth

import (
	"net/http"

	"diploma/src/config"
	generate "diploma/src/tokens"

	"github.com/gin-gonic/gin"
)

type AuthController struct {
	Service *AuthService
}

func NewAuthController(service *AuthService) *AuthController {
	return &AuthController{
		Service: service,
	}
}

//nolint:dupl // дублирование допустимо в данном случае
func (c *AuthController) LoginHandler(ctx *gin.Context) {
	var loginDTO LoginDTO

	if err := ctx.ShouldBindJSON(&loginDTO); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.Validate.Struct(loginDTO); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := c.Service.Login(loginDTO)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	accessToken, refreshToken, err := generate.TokenGenerator(user.Email, user.FirstName, user.LastName, user.ID.Hex())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate access token"})
		return
	}

	// Успешный ответ
	ctx.JSON(http.StatusOK, gin.H{
		"message":       "Login successful",
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

//nolint:dupl // дублирование допустимо в данном случае
func (c *AuthController) SignUpHandler(ctx *gin.Context) {
	var signUpDTO SignUpDTO

	if err := ctx.ShouldBindJSON(&signUpDTO); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.Validate.Struct(signUpDTO); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	user, err := c.Service.SignUp(signUpDTO)
	if err != nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": err.Error()})
		return
	}

	accessToken, refreshToken, err := generate.TokenGenerator(user.Email, user.FirstName, user.LastName, user.ID.Hex())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate access token"})
		return
	}

	// Успешный ответ
	ctx.JSON(http.StatusCreated, gin.H{
		"message":       "Registration successful",
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}

func (*AuthController) RefreshTokenHandler(ctx *gin.Context) {
	var body struct {
		RefreshToken string `json:"refresh_token" binding:"required"`
	}

	if err := ctx.ShouldBindJSON(&body); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Refresh token is required"})
		return
	}

	claims, err := generate.ValidateToken(body.RefreshToken)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid refresh token"})
		return
	}

	accessToken, refreshToken, err := generate.TokenGenerator(claims.Email, claims.FirstName, claims.LastName, claims.Uid)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate tokens"})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	})
}
