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

func NewUnitService() *UnitService {
	return &UnitService{
		Collection:      database.GetCollection(database.Client, "Unit"),
		LevelCollection: database.GetCollection(database.Client, "Level"),
	}
}

func (s *UnitService) CreateUnit(dto *CreateUnitDTO) (*Unit, error) {
	fmt.Printf("Received LevelID: %s\n", dto.LevelID)

	levelID, err := primitive.ObjectIDFromHex(dto.LevelID)
	if err != nil {
		fmt.Printf("Invalid LevelID: %s, error: %v\n", dto.LevelID, err)
		return nil, fmt.Errorf("invalid level ID: %w", err)
	}

	// Проверяем, существует ли уровень
	var level bson.M
	err = s.LevelCollection.FindOne(context.Background(), bson.M{"_id": levelID}).Decode(&level)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, fmt.Errorf("level with ID %s not found", dto.LevelID)
		}
		return nil, fmt.Errorf("failed to check level existence: %w", err)
	}

	// Создаем новый unit
	unit := Unit{
		ID:           primitive.NewObjectID(),
		Title:        dto.Title,
		LevelID:      levelID,
		Tasks:        []primitive.ObjectID{},
		Completed:    []primitive.ObjectID{},
		Descriptions: dto.Descriptions,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}

	_, err = s.Collection.InsertOne(context.Background(), unit)
	if err != nil {
		return nil, fmt.Errorf("failed to create unit: %w", err)
	}

	// 🔥 Не трогаем level.units вообще

	return &unit, nil
}

func (s *UnitService) GetAllUnits() ([]Unit, error) {
	var units []Unit
	cursor, err := s.Collection.Find(context.Background(), bson.M{})
	if err != nil {
		return nil, fmt.Errorf("failed to find units: %w", err)
	}
	defer cursor.Close(context.Background())

	for cursor.Next(context.Background()) {
		var unit Unit
		if err := cursor.Decode(&unit); err != nil {
			return nil, fmt.Errorf("failed to decode unit: %w", err)
		}
		units = append(units, unit)
	}

	if err := cursor.Err(); err != nil {
		return nil, fmt.Errorf("cursor error: %w", err)
	}

	return units, nil
}

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

func (s *UnitService) UpdateUnit(unitID primitive.ObjectID, dto UpdateUnitDTO) (*Unit, error) {
	updateData := bson.M{
		"updated_at": time.Now(),
	}

	if dto.Title != "" {
		updateData["title"] = dto.Title
	}

	if (dto.Descriptions != LocalizedDescription{}) {
		updateData["descriptions"] = dto.Descriptions
	}

	update := bson.M{"$set": updateData}

	_, err := s.Collection.UpdateOne(context.Background(), bson.M{"_id": unitID}, update)
	if err != nil {
		return nil, fmt.Errorf("failed to update unit: %w", err)
	}

	return s.GetUnitByID(unitID)
}

// Удаление блока
func (s *UnitService) DeleteUnit(unitID primitive.ObjectID) error {
	_, err := s.Collection.DeleteOne(context.Background(), bson.M{"_id": unitID})
	return err
}

func (s *UnitService) GetUnitByID(unitID primitive.ObjectID) (*Unit, error) {
	var unit Unit
	err := s.Collection.FindOne(context.Background(), bson.M{"_id": unitID}).Decode(&unit)
	if err != nil {
		return nil, fmt.Errorf("unit not found: %w", err)
	}

	return &unit, nil
}
