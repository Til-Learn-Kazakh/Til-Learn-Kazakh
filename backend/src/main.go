package main

import (
	"log"
	"os"

	"diploma/src/middlewares"
	"diploma/src/modules/auth"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Получение порта из переменной окружения

	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	CORS_ORIGIN := os.Getenv("CORS_ORIGIN")

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080" // Значение по умолчанию
		log.Println("PORT не задан, используется порт по умолчанию: 8080")
	}

	authController := auth.NewAuthController(auth.NewAuthService())

	router := gin.New()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{CORS_ORIGIN, "http://192.168.0.10:19000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.Use(gin.Logger())

	apiRoutes := router.Group("/api/v1")

	auth.AuthRoutes(apiRoutes, authController)
	apiRoutes.Use(middlewares.Authentication())

	log.Fatal(router.Run(":" + port))
}
