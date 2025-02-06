package main

import (
	"log"
	"os"

	"diploma/src/middlewares"
	"diploma/src/modules"
	"diploma/src/modules/auth"
	"diploma/src/modules/level"
	"diploma/src/modules/streak"
	"diploma/src/modules/task"
	"diploma/src/modules/unit"
	"diploma/src/modules/user"
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

	streakService := streak.NewStreakService()
	streakController := streak.NewStreakController(streakService)

	authService := auth.NewAuthService(streakService)
	authController := auth.NewAuthController(authService)

	levelService := level.NewLevelService()
	levelController := level.NewLevelController(levelService)

	unitService := unit.NewUnitService()
	unitController := unit.NewUnitController(unitService)

	taskService := task.NewTaskService()
	taskController := task.NewTaskController(taskService)

	userService := user.NewUserService()
	userController := user.NewUserController(userService)

	router := gin.New()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{CORS_ORIGIN, "http://192.168.0.11:19000"},
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
	level.LevelRoutes(apiRoutes, levelController)
	unit.UnitRoutes(apiRoutes, unitController)
	task.TaskRoutes(apiRoutes, taskController)
	user.UserRoutes(apiRoutes, userController)
	streak.StreakRoutes(apiRoutes, streakController)

	log.Fatal(router.Run(":" + port))
}
