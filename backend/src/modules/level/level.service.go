package level

import (
	"context"
	"diploma/src/database"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type LevelService struct {
	Collection     *mongo.Collection
	UnitCollection *mongo.Collection
}

func NewLevelService() *LevelService {
	return &LevelService{
		Collection:     database.GetCollection(database.Client, "Level"),
		UnitCollection: database.GetCollection(database.Client, "Unit"),
	}
}

// Создание нового уровня
func (s *LevelService) CreateLevel(dto CreateLevelDTO) (*Level, error) {
	level := Level{
		ID:        primitive.NewObjectID(),
		Name:      dto.Name,
		Units:     nil,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	_, err := s.Collection.InsertOne(context.Background(), level)
	if err != nil {
		return nil, err
	}

	return &level, nil
}

func (s *LevelService) GetAllLevels() ([]Level, error) {
	pipeline := mongo.Pipeline{
		{
			{Key: "$lookup", Value: bson.D{
				{Key: "from", Value: "Unit"},
				{Key: "localField", Value: "_id"},
				{Key: "foreignField", Value: "level_id"},
				{Key: "as", Value: "units"},
			}},
		},
		// Добавляем progress в units
		{
			{Key: "$addFields", Value: bson.D{
				{Key: "units", Value: bson.D{
					{Key: "$map", Value: bson.D{
						{Key: "input", Value: "$units"},
						{Key: "as", Value: "u"},
						{Key: "in", Value: bson.D{
							// Копируем все поля юнита
							{Key: "_id", Value: "$$u._id"},
							{Key: "title", Value: "$$u.title"},
							{Key: "level_id", Value: "$$u.level_id"},
							{Key: "tasks", Value: "$$u.tasks"},
							{Key: "completed", Value: "$$u.completed"},
							{Key: "descriptions", Value: "$$u.descriptions"},
							{Key: "created_at", Value: "$$u.created_at"},
							{Key: "updated_at", Value: "$$u.updated_at"},

							// Считаем прогресс
							{Key: "progress", Value: bson.D{
								{Key: "$cond", Value: bson.A{
									// Если tasks пустой, то progress = 100%
									bson.D{{Key: "$eq", Value: bson.A{bson.D{{Key: "$size", Value: "$$u.tasks"}}, 0}}},
									100,
									bson.D{{Key: "$multiply", Value: bson.A{
										bson.D{{Key: "$divide", Value: bson.A{
											bson.D{{Key: "$size", Value: "$$u.completed"}},
											bson.D{{Key: "$size", Value: "$$u.tasks"}},
										}}},
										100,
									}}},
								}},
							}},
						}},
					}},
				}},
			}},
		},
	}

	cursor, err := s.Collection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, fmt.Errorf("aggregation error: %w", err)
	}
	defer cursor.Close(context.Background())

	var levels []Level
	if err := cursor.All(context.Background(), &levels); err != nil {
		return nil, fmt.Errorf("cursor decoding error: %w", err)
	}

	return levels, nil
}

func (s *LevelService) DeleteLevel(levelID primitive.ObjectID) error {
	session, err := s.Collection.Database().Client().StartSession()
	if err != nil {
		return fmt.Errorf("failed to start session: %w", err)
	}
	defer session.EndSession(context.Background())

	err = mongo.WithSession(context.Background(), session, func(sc mongo.SessionContext) error {
		_, err = s.UnitCollection.DeleteMany(sc, bson.M{"level_id": levelID})
		if err != nil {
			abortErr := session.AbortTransaction(sc)
			if abortErr != nil {
				return fmt.Errorf("failed to abort transaction: %w (original error: %w)", abortErr, err)
			}
			return fmt.Errorf("failed to delete units: %w", err)
		}

		_, err = s.Collection.DeleteOne(sc, bson.M{"_id": levelID})
		if err != nil {
			abortErr := session.AbortTransaction(sc)
			if abortErr != nil {
				return fmt.Errorf("failed to abort transaction: %w (original error: %w)", abortErr, err)
			}
			return fmt.Errorf("failed to delete level: %w", err)
		}

		return session.CommitTransaction(sc)
	})

	return err
}
