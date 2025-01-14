package main

import (
	"log"
	"os"

	"diploma/src/database"
	"diploma/src/middlewares"
	"diploma/src/modules"
	"diploma/src/modules/auth"
	"diploma/src/modules/lesson"
	"diploma/src/services"

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

	imageService := services.NewImageService() // src/public будет базовым путем

	lessonService := lesson.LessonService{
		Collection:   database.GetCollection(database.Client, "Lessons"), // Подключение к коллекции "Lessons"
		ImageService: imageService,                                       // Передаем корректный экземпляр ImageService
	}

	lessonController := lesson.LessonController{
		Service: &lessonService,
	}
	router := gin.New()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{CORS_ORIGIN, "http://192.168.0.10:19000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.Use(gin.Logger())

	apiRoutes := router.Group("/api/v1")
	audioService := services.NewAudioService()
	audioController := modules.NewAudioController(audioService)

	// Маршрут для воспроизведения аудио
	router.GET("/api/v1/audio/:fileName", audioController.PlayAudio)

	auth.AuthRoutes(apiRoutes, authController)
	apiRoutes.Use(middlewares.Authentication())
	lesson.LessonRoutes(apiRoutes, &lessonController)

	log.Fatal(router.Run(":" + port))
}
