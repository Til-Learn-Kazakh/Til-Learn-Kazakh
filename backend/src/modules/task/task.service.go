package task

import (
	"context"
	"diploma/src/database"
	"diploma/src/services"
	"errors"
	"fmt"
	"mime/multipart"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type TaskService struct {
	Collection     *mongo.Collection
	UnitCollection *mongo.Collection
}

// Конструктор для TaskService
func NewTaskService() *TaskService {
	return &TaskService{
		Collection:     database.GetCollection(database.Client, "Task"),
		UnitCollection: database.GetCollection(database.Client, "Unit"),
	}
}

func (s *TaskService) CreateTask(dto *CreateTaskDTO, imageFile multipart.File, imageHeader *multipart.FileHeader, imageOptionsFiles []*multipart.FileHeader) (*Task, error) {
	unitID, err := primitive.ObjectIDFromHex(dto.UnitID)
	if err != nil {
		return nil, fmt.Errorf("invalid unit ID: %w", err)
	}

	unitExists, err := s.UnitCollection.CountDocuments(context.Background(), bson.M{"_id": unitID})
	if err != nil {
		return nil, fmt.Errorf("failed to check unit existence: %w", err)
	}
	if unitExists == 0 {
		return nil, fmt.Errorf("unit with ID %s does not exist", dto.UnitID)
	}

	var imagePath string
	if imageFile != nil && imageHeader != nil {
		imageService := services.NewImageService()
		imagePath, err = imageService.SaveImage("tasks", imageFile, imageHeader)
		if err != nil {
			return nil, fmt.Errorf("failed to save image: %w", err)
		}
	}

	var savedImageOptions []ImageOption
	var savedPaths []string
	var imageService *services.ImageService
	if len(imageOptionsFiles) > 0 {
		imageService = services.NewImageService()
		savedPaths, err = imageService.SaveMultipleImages("tasks/options", imageOptionsFiles, nil)
		if err != nil {
			return nil, fmt.Errorf("failed to save image options: %w", err)
		}

		for i, option := range dto.ImageOptions {
			if i < len(savedPaths) {
				option.Image = savedPaths[i]
			} else {
				option.Image = ""
			}
			savedImageOptions = append(savedImageOptions, option)
		}
	} else {
		savedImageOptions = dto.ImageOptions
	}

	task := Task{
		ID:                     primitive.NewObjectID(),
		UnitID:                 unitID,
		Type:                   TaskType(dto.Type),
		Question:               dto.Question,
		CorrectAnswer:          dto.CorrectAnswer,
		Hints:                  dto.Hints,
		AudioPath:              dto.AudioPath,
		ImagePath:              imagePath,
		Order:                  dto.Order,
		Sentence:               dto.Sentence,
		Description:            dto.Description,
		HighlightedWord:        dto.HighlightedWord,
		LocalizedHints:         dto.LocalizedHints,
		LocalizedCorrectAnswer: dto.LocalizedCorrectAnswer,
		ImageOptions:           savedImageOptions,
		CreatedAt:              time.Now(),
		UpdatedAt:              time.Now(),
	}

	_, err = s.Collection.InsertOne(context.Background(), task)
	if err != nil {
		return nil, err
	}

	_, err = s.UnitCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": unitID},
		bson.M{"$push": bson.M{"tasks": task.ID}},
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update unit with new task: %w", err)
	}

	return &task, nil
}

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

func (s *TaskService) CheckAnswer(taskID primitive.ObjectID, userAnswer, userLang string) (isCorrect bool, correctAnswerText string, err error) {
	var task Task
	err = s.Collection.FindOne(context.Background(), bson.M{"_id": taskID}).Decode(&task)
	if err != nil {
		err = fmt.Errorf("task not found: %w", err)
		return false, "", err
	}

	isCorrect = (userAnswer == task.CorrectAnswer)
	correctAnswerText = ""

	if !isCorrect && len(task.ImageOptions) > 0 {
		for _, option := range task.ImageOptions {
			if option.ID == task.CorrectAnswer {
				correctAnswerText = option.Text
				break
			}
		}
	}

	if len(task.LocalizedCorrectAnswer) > 0 && userLang != "" {
		realCorrectAnswer := task.LocalizedCorrectAnswer[userLang]
		if realCorrectAnswer == "" {
			realCorrectAnswer = task.CorrectAnswer
		}
		isCorrect = (userAnswer == realCorrectAnswer)
		if !isCorrect && correctAnswerText == "" {
			correctAnswerText = realCorrectAnswer
		}
	}

	if correctAnswerText == "" {
		correctAnswerText = task.CorrectAnswer
	}

	return isCorrect, correctAnswerText, nil
}

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

func (s *TaskService) GetTaskByID(taskID primitive.ObjectID) (*Task, error) {
	var task Task
	err := s.Collection.FindOne(context.Background(), bson.M{"_id": taskID}).Decode(&task)
	if err != nil {
		return nil, fmt.Errorf("task not found: %w", err)
	}

	return &task, nil
}

func (s *TaskService) DeleteTask(taskID primitive.ObjectID) error {
	_, err := s.Collection.DeleteOne(context.Background(), bson.M{"_id": taskID})
	return err
}
