package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var DatabaseName string

func DBSet() *mongo.Client {
	err := godotenv.Load()
	if err != nil {
		log.Println("Ошибка загрузки .env файла:", err)
	}

	// Получаем URI и имя базы данных из переменных окружения
	mongoURI := os.Getenv("MONGO_URI_DEVELOPMENT")
	DatabaseName = os.Getenv("MONGO_DATABASE")

	if mongoURI == "" || DatabaseName == "" {
		log.Fatal("Переменные окружения MONGO_URI_DEVELOPMENT или MONGO_DATABASE не заданы")
	}

	// Подключение к MongoDB
	client, err := mongo.Connect(context.TODO(), options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal("Ошибка подключения к MongoDB:", err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)

	defer cancel()

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Println("Failed to connect to mongoDb :(")
		return nil
	}
	fmt.Printf("Successfully connected to MongoDb ")
	return client
}

var Client *mongo.Client = DBSet()

func GetCollection(client *mongo.Client, collectionName string) *mongo.Collection {
	return client.Database(DatabaseName).Collection(collectionName)
}
