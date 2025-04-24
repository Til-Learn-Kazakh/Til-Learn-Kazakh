//go:build ignore
// +build ignore

package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// ---------------------- Structures ---------------------- //

type Unit struct {
	ID           primitive.ObjectID   `bson:"_id,omitempty" json:"_id,omitempty"`
	Title        string               `bson:"title" json:"title"`
	LevelID      primitive.ObjectID   `bson:"level_id" json:"level_id"`
	Tasks        []primitive.ObjectID `bson:"tasks" json:"tasks"` // список ID задач
	Completed    []primitive.ObjectID `bson:"completed" json:"completed"`
	Descriptions map[string]string    `bson:"descriptions" json:"descriptions"`
	Progress     int                  `bson:"progress" json:"progress"`
	CreatedAt    time.Time            `bson:"created_at" json:"created_at"`
	UpdatedAt    time.Time            `bson:"updated_at" json:"updated_at"`
}

type Task struct {
	ID            primitive.ObjectID `bson:"_id,omitempty" json:"_id,omitempty"`
	UnitID        primitive.ObjectID `bson:"unit_id" json:"unit_id"`
	Type          string             `bson:"type" json:"type"`
	Question      map[string]string  `bson:"question,omitempty" json:"question,omitempty"`
	CorrectAnswer string             `bson:"correct_answer,omitempty" json:"correct_answer,omitempty"`
	Hints         []string           `bson:"hints,omitempty" json:"hints,omitempty"`
	ImagePath     string             `bson:"image_path,omitempty" json:"image_path,omitempty"`
	AudioPath     string             `bson:"audio_path,omitempty" json:"audio_path,omitempty"`
	Order         int                `bson:"order" json:"order"`
	CreatedAt     time.Time          `bson:"created_at" json:"created_at"`
	UpdatedAt     time.Time          `bson:"updated_at" json:"updated_at"`
	// Доп. поля, если нужны
	Sentence               []string            `bson:"sentence,omitempty" json:"sentence,omitempty"`
	Description            map[string]string   `bson:"description,omitempty" json:"description,omitempty"`
	HighlightedWord        map[string]string   `bson:"highlighted_word,omitempty" json:"highlighted_word,omitempty"`
	ImageOptions           []ImageOption       `bson:"image_options,omitempty" json:"image_options,omitempty"`
	LocalizedHints         map[string][]string `bson:"localized_hints,omitempty" json:"localized_hints,omitempty"`
	LocalizedCorrectAnswer map[string]string   `bson:"localized_correct_answer,omitempty" json:"localized_correct_answer,omitempty"`
}

type ImageOption struct {
	ID    string            `bson:"id" json:"id"`
	Text  map[string]string `bson:"text" json:"text"` // Localized text
	Image string            `bson:"image" json:"image"`
}

// LessonData - структура для JSON-файла: в нём один unit и массив tasks
type LessonData struct {
	Unit  Unit   `json:"unit"`
	Tasks []Task `json:"tasks"`
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// ----------------------------------------------------
	// 1) Подключаемся к MongoDB (укажи свой connection string)
	// ----------------------------------------------------
	uri := "mongodb+srv://4zamat:XaakEVb8iD7S@cluster0.yke2ewi.mongodb.net/Diploma4?retryWrites=true&w=majority"
	clientOpts := options.Client().ApplyURI(uri)
	client, err := mongo.Connect(ctx, clientOpts)
	if err != nil {
		log.Fatal("Mongo connection error:", err)
	}
	defer client.Disconnect(ctx)

	db := client.Database("Diploma4") // Можно указать другое, если нужно

	unitsColl := db.Collection("Unit")
	tasksColl := db.Collection("Task")

	// ----------------------------------------------------
	// 2) Считываем JSON-файл (Lesson1.json)
	// ----------------------------------------------------
	filePath := "src/script/Lesson2.json"
	jsonBytes, err := os.ReadFile(filePath)
	if err != nil {
		log.Fatalf("Failed to read JSON file %s: %v", filePath, err)
	}

	var lesson LessonData
	if err := json.Unmarshal(jsonBytes, &lesson); err != nil {
		log.Fatalf("JSON unmarshal error: %v", err)
	}

	// ----------------------------------------------------
	// 3) Сначала Upsert Tasks, собираем их ObjectID
	// ----------------------------------------------------
	var taskIDs []primitive.ObjectID
	for _, t := range lesson.Tasks {
		// Upsert (ReplaceOne) для каждой задачи
		filter := bson.M{"_id": t.ID}
		opts := options.Replace().SetUpsert(true)

		_, err := tasksColl.ReplaceOne(ctx, filter, t, opts)
		if err != nil {
			log.Printf("Failed upsert task %v: %v\n", t.ID, err)
		} else {
			fmt.Printf("Task %s upserted.\n", t.ID.Hex())
		}

		taskIDs = append(taskIDs, t.ID)
	}

	// ----------------------------------------------------
	// 4) Теперь прописываем массив tasks в самом Unit
	// ----------------------------------------------------
	// Чтобы при запросе из коллекции units можно было сразу получить все таски
	lesson.Unit.Tasks = taskIDs

	// Upsert (ReplaceOne) юнита
	filterUnit := bson.M{"_id": lesson.Unit.ID}
	optsUnit := options.Replace().SetUpsert(true)

	_, err = unitsColl.ReplaceOne(ctx, filterUnit, lesson.Unit, optsUnit)
	if err != nil {
		log.Fatalf("Failed upsert unit %v: %v", lesson.Unit.ID, err)
	}
	fmt.Printf("Unit %s upserted with tasks.\n", lesson.Unit.ID.Hex())

	fmt.Println("Import finished successfully!")
}
