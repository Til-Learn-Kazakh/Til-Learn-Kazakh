package lesson

import (
	"context"
	"diploma/src/services"
	"fmt"
	"mime/multipart"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type LessonService struct {
	Collection   *mongo.Collection
	ImageService *services.ImageService
}

// Создание нового урока
func (s *LessonService) CreateLesson(dto CreateLessonDTO, file multipart.File, fileHeader *multipart.FileHeader) (*Lesson, error) {
	// Сохраняем иконку в папке "lesson"
	iconPath, err := s.ImageService.SaveImage("lesson", file, fileHeader)
	if err != nil {
		return nil, fmt.Errorf("failed to save icon: %w", err)
	}

	// Создаем урок
	lesson := Lesson{
		ID:        primitive.NewObjectID(),
		Name:      dto.Name,
		Icon:      iconPath,
		Tasks:     []primitive.ObjectID{},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	_, err = s.Collection.InsertOne(context.Background(), lesson)
	if err != nil {
		return nil, err
	}

	return &lesson, nil
}

// Получение всех уроков
func (s *LessonService) GetAllLessons() ([]Lesson, error) {
	cursor, err := s.Collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var lessons []Lesson
	if err := cursor.All(context.Background(), &lessons); err != nil {
		return nil, err
	}

	return lessons, nil
}

// Получение урока по ID
func (s *LessonService) GetLessonByID(lessonID primitive.ObjectID) (*Lesson, error) {
	var lesson Lesson
	err := s.Collection.FindOne(context.Background(), bson.M{"_id": lessonID}).Decode(&lesson)
	if err != nil {
		return nil, err
	}

	return &lesson, nil
}

// Обновление урока
func (s *LessonService) UpdateLesson(lessonID primitive.ObjectID, dto UpdateLessonDTO, file multipart.File, fileHeader *multipart.FileHeader) (*Lesson, error) {
	// Получаем текущий урок
	lesson, err := s.GetLessonByID(lessonID)
	if err != nil {
		return nil, fmt.Errorf("lesson not found: %w", err)
	}

	// Обновляем иконку, если файл предоставлен
	var iconPath string
	if file != nil && fileHeader != nil {
		// Удаляем старую иконку
		if lesson.Icon != "" {
			err = s.ImageService.DeleteImage(lesson.Icon) // Добавим метод DeleteImage
			if err != nil {
				return nil, fmt.Errorf("failed to delete old icon: %w", err)
			}
		}

		// Сохраняем новую иконку
		iconPath, err = s.ImageService.SaveImage("lesson", file, fileHeader)
		if err != nil {
			return nil, fmt.Errorf("failed to save new icon: %w", err)
		}
	} else {
		// Если файл не предоставлен, оставляем старый путь к иконке
		iconPath = lesson.Icon
	}

	// Формируем данные для обновления
	update := bson.M{
		"$set": bson.M{
			"name":       dto.Name,
			"icon":       iconPath,
			"updated_at": time.Now(),
		},
	}

	// Обновляем урок в базе данных
	_, err = s.Collection.UpdateOne(context.Background(), bson.M{"_id": lessonID}, update)
	if err != nil {
		return nil, err
	}

	// Возвращаем обновленный урок
	return s.GetLessonByID(lessonID)
}

// Удаление урока
func (s *LessonService) DeleteLesson(lessonID primitive.ObjectID) error {
	_, err := s.Collection.DeleteOne(context.Background(), bson.M{"_id": lessonID})
	return err
}
