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

// NewAuthController создаёт новый экземпляр AuthController
func NewAuthController(service *AuthService) *AuthController {
	return &AuthController{
		Service: service,
	}
}

//nolint:dupl // дублирование допустимо в данном случае
func (c *AuthController) LoginHandler(ctx *gin.Context) {
	var loginDTO LoginDTO

	// Валидация входных данных
	if err := ctx.ShouldBindJSON(&loginDTO); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.Validate.Struct(loginDTO); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	// Логика авторизации
	user, err := c.Service.Login(loginDTO)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	// Генерация токена
	accessToken, _, err := generate.TokenGenerator(user.Email, user.FirstName, user.LastName, user.ID.Hex())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate access token"})
		return
	}

	// Успешный ответ
	ctx.JSON(http.StatusOK, gin.H{
		"message":      "Login successful",
		"access_token": accessToken,
	})
}

//nolint:dupl // дублирование допустимо в данном случае
func (c *AuthController) SignUpHandler(ctx *gin.Context) {
	var signUpDTO SignUpDTO

	// Валидация JSON
	if err := ctx.ShouldBindJSON(&signUpDTO); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Дополнительная валидация через Validate
	if err := config.Validate.Struct(signUpDTO); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Вызов сервиса для регистрации
	user, err := c.Service.SignUp(signUpDTO)
	if err != nil {
		ctx.JSON(http.StatusConflict, gin.H{"error": err.Error()}) // Ошибка, если email уже существует
		return
	}

	// Генерация токена
	accessToken, _, err := generate.TokenGenerator(user.Email, user.FirstName, user.LastName, user.ID.Hex())
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate access token"})
		return
	}

	// Успешный ответ
	ctx.JSON(http.StatusCreated, gin.H{
		"message":      "Registration successful",
		"access_token": accessToken,
	})
}
