package unit

import (
	"context"
	"diploma/src/database"
	"errors"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UnitService struct {
	Collection      *mongo.Collection
	LevelCollection *mongo.Collection
}

// Конструктор для UnitService
func NewUnitService() *UnitService {
	return &UnitService{
		Collection:      database.GetCollection(database.Client, "Unit"),
		LevelCollection: database.GetCollection(database.Client, "Level"),
	}
}

// Создание нового блока
func (s *UnitService) CreateUnit(dto *CreateUnitDTO) (*Unit, error) {
	levelID, err := primitive.ObjectIDFromHex(dto.LevelID)
	if err != nil {
		return nil, fmt.Errorf("invalid level ID: %w", err)
	}

	// Проверяем, существует ли указанный LevelID в базе данных
	var level bson.M
	err = s.LevelCollection.FindOne(context.Background(), bson.M{"_id": levelID}).Decode(&level)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, fmt.Errorf("level with ID %s not found", dto.LevelID)
		}
		return nil, fmt.Errorf("failed to check level existence: %w", err)
	}

	unit := Unit{
		ID:           primitive.NewObjectID(),
		Title:        dto.Title,
		LevelID:      levelID,
		Tasks:        []primitive.ObjectID{}, // Пустой список задач при создании
		Completed:    []primitive.ObjectID{}, // Пустой список выполненных заданий
		Descriptions: dto.Descriptions,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	// Вставляем Unit в коллекцию
	_, err = s.Collection.InsertOne(context.Background(), unit)
	if err != nil {
		return nil, fmt.Errorf("failed to create unit: %w", err)
	}

	// Обновляем Level, добавляя созданный Unit
	_, err = s.LevelCollection.UpdateOne(
		context.Background(),
		bson.M{"_id": levelID},                    // Условие: обновляем уровень с этим ID
		bson.M{"$push": bson.M{"units": unit.ID}}, // Добавляем ID Unit в массив Units
	)
	if err != nil {
		return nil, fmt.Errorf("failed to update level with new unit: %w", err)
	}

	return &unit, nil
}

// Получение всех блоков по LevelID
func (s *UnitService) GetUnitsByLevelID(levelID primitive.ObjectID) ([]Unit, error) {
	cursor, err := s.Collection.Find(context.Background(), bson.M{"level_id": levelID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	var units []Unit
	if err := cursor.All(context.Background(), &units); err != nil {
		return nil, err
	}

	return units, nil
}

// Обновление блока
func (s *UnitService) UpdateUnit(unitID primitive.ObjectID, dto UpdateUnitDTO) (*Unit, error) {
	update := bson.M{
		"$set": bson.M{
			"title":      dto.Title,
			"updated_at": time.Now(),
		},
	}

	_, err := s.Collection.UpdateOne(context.Background(), bson.M{"_id": unitID}, update)
	if err != nil {
		return nil, err
	}

	return s.GetUnitByID(unitID)
}

// Удаление блока
func (s *UnitService) DeleteUnit(unitID primitive.ObjectID) error {
	_, err := s.Collection.DeleteOne(context.Background(), bson.M{"_id": unitID})
	return err
}

// Получение блока по ID
func (s *UnitService) GetUnitByID(unitID primitive.ObjectID) (*Unit, error) {
	var unit Unit
	err := s.Collection.FindOne(context.Background(), bson.M{"_id": unitID}).Decode(&unit)
	if err != nil {
		return nil, fmt.Errorf("unit not found: %w", err)
	}

	return &unit, nil
}
