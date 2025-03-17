package main

import (
	"log"
	"os"

	"diploma/src/middlewares"
	"diploma/src/modules/analytics"
	"diploma/src/modules/auth"
	"diploma/src/modules/level"
	"diploma/src/modules/streak"
	"diploma/src/modules/task"
	"diploma/src/modules/unit"
	"diploma/src/modules/user"

	"github.com/gin-contrib/cors"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	CORS_ORIGIN := os.Getenv("CORS_ORIGIN")

	port := os.Getenv("PORT")

	if port == "" {
		port = "8080"
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

	userService := user.NewUserService()
	userController := user.NewUserController(userService)

	analyticsService := analytics.NewAnalyticsService()
	analyticsController := analytics.NewAnalyticsController(analyticsService)

	taskService := task.NewTaskService()
	taskController := task.NewTaskController(taskService, userService)

	router := gin.New()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{CORS_ORIGIN, "http://192.168.0.12:19000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.Use(gin.Logger(), gin.Recovery())

	rateLimiter := middlewares.NewRateLimiter()
	router.Use(middlewares.RateLimitMiddleware(rateLimiter))

	router.Static("/src/public", "./src/public")

	apiRoutes := router.Group("/api/v1")

	auth.AuthRoutes(apiRoutes, authController)
	apiRoutes.Use(middlewares.Authentication())
	level.LevelRoutes(apiRoutes, levelController)
	unit.UnitRoutes(apiRoutes, unitController)
	task.TaskRoutes(apiRoutes, taskController)
	user.UserRoutes(apiRoutes, userController)
	streak.StreakRoutes(apiRoutes, streakController)
	analytics.AnalyticsRoutes(apiRoutes, analyticsController)

	log.Fatal(router.Run(":" + port))
}
