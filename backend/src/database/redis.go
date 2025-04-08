package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/redis/go-redis/v9"
)

var RedisClient *redis.Client
var Ctx = context.Background()

func InitRedis() {
	_ = godotenv.Load() // Загрузка переменных из .env
	RedisClient = redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PORT")),
		Password: os.Getenv("REDIS_PASSWORD"), // <-- добавили
		DB:       0,
	})

	ctx, cancel := context.WithTimeout(Ctx, 3*time.Second)
	defer cancel()

	if _, err := RedisClient.Ping(ctx).Result(); err != nil {
		panic("❌ Ошибка подключения к Redis: " + err.Error())
	}
	fmt.Println("✅ Успешное подключение к Redis")

	err := RedisClient.Set(ctx, "til:hello", "world", 0).Err()
	if err != nil {
		log.Fatalf("❌ Ошибка записи в Redis: %v", err)
	}

	log.Println("✅ Ключ 'til:hello' успешно записан в Redis")
}
