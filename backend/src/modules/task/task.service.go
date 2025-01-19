package task

import (
	"context"
	"diploma/src/database"
	"errors"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TaskService struct {
	Collection     *mongo.Collection // Коллекция задач
	UnitCollection *mongo.Collection // Коллекция блоков (Units)
}

// Конструктор для TaskService
func NewTaskService() *TaskService {
	return &TaskService{
		Collection:     database.GetCollection(database.Client, "Task"), // Подключение к коллекции "Task"
		UnitCollection: database.GetCollection(database.Client, "Unit"), // Подключение к коллекции "Unit"
	}
}

// Создание новой задачи
func (s *TaskService) CreateTask(dto *CreateTaskDTO) (*Task, error) {
	// Проверяем валидность UnitID
	unitID, err := primitive.ObjectIDFromHex(dto.UnitID)
	if err != nil {
		return nil, fmt.Errorf("invalid unit ID: %w", err)
	}

	// Проверяем существование Unit в базе данных
	unitExists, err := s.UnitCollection.CountDocuments(context.Background(), bson.M{"_id": unitID})
	if err != nil {
		return nil, fmt.Errorf("failed to check unit existence: %w", err)
	}
	if unitExists == 0 {
		return nil, fmt.Errorf("unit with ID %s does not exist", dto.UnitID)
	}

	// Создаем задачу
	task := Task{
		ID:            primitive.NewObjectID(),
		UnitID:        unitID,
		Type:          TaskType(dto.Type),
		Question:      dto.Question,
		CorrectAnswer: dto.CorrectAnswer,
		Hints:         dto.Hints,
		AudioPath:     dto.AudioPath,
		ImagePath:     dto.ImagePath,
		Order:         dto.Order,
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	// Сохраняем задачу в базе данных
	_, err = s.Collection.InsertOne(context.Background(), task)
	if err != nil {
		return nil, err
	}

	// Обновляем Unit, добавляя TaskID в массив tasks
	_, err = s.UnitCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": unitID},
		bson.M{"$push": bson.M{"tasks": task.ID}}, // Добавляем TaskID в массив tasks
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update unit with new task: %w", err)
	}

	return &task, nil
}

// Получение всех задач по UnitID
func (s *TaskService) GetTasksByUnitID(unitID primitive.ObjectID) ([]Task, error) {
	cursor, err := s.Collection.Find(context.Background(), bson.M{"unit_id": unitID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var tasks []Task
	if err := cursor.All(context.Background(), &tasks); err != nil {
		return nil, err
	}

	return tasks, nil
}

func (s *TaskService) GetNextTask(unitID primitive.ObjectID, currentOrder int) (*Task, error) {
	// Найти задачу с порядковым номером больше текущего
	filter := bson.M{
		"unit_id": unitID,
		"order":   bson.M{"$gt": currentOrder},
	}
	opts := options.FindOne().SetSort(bson.D{
		bson.E{Key: "order", Value: 1},
	})
	var nextTask Task
	err := s.Collection.FindOne(context.Background(), filter, opts).Decode(&nextTask)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, fmt.Errorf("no more tasks found")
		}

		return nil, fmt.Errorf("failed to fetch next task: %w", err)
	}

	return &nextTask, nil
}

func (s *TaskService) CheckAnswer(taskID primitive.ObjectID, userAnswer string) (bool, error) {
	var task Task
	err := s.Collection.FindOne(context.Background(), bson.M{"_id": taskID}).Decode(&task)
	if err != nil {
		return false, fmt.Errorf("task not found: %w", err)
	}

	isCorrect := task.CorrectAnswer == userAnswer
	return isCorrect, nil
}

// Обновление задачи
func (s *TaskService) UpdateTask(taskID primitive.ObjectID, dto *UpdateTaskDTO) (*Task, error) {
	update := bson.M{
		"$set": bson.M{
			"type":           dto.Type,
			"question":       dto.Question,
			"correct_answer": dto.CorrectAnswer,
			"hints":          dto.Hints,
			"audio_path":     dto.AudioPath,
			"image_path":     dto.ImagePath,
			"order":          dto.Order,
			"updated_at":     time.Now(),
		},
	}

	_, err := s.Collection.UpdateOne(context.Background(), bson.M{"_id": taskID}, update)
	if err != nil {
		return nil, err
	}

	return s.GetTaskByID(taskID)
}

// Получение задачи по ID
func (s *TaskService) GetTaskByID(taskID primitive.ObjectID) (*Task, error) {
	var task Task
	err := s.Collection.FindOne(context.Background(), bson.M{"_id": taskID}).Decode(&task)
	if err != nil {
		return nil, fmt.Errorf("task not found: %w", err)
	}

	return &task, nil
}

// Удаление задачи
func (s *TaskService) DeleteTask(taskID primitive.ObjectID) error {
	_, err := s.Collection.DeleteOne(context.Background(), bson.M{"_id": taskID})
	return err
}
