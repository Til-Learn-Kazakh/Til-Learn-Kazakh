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

// Конструктор для LevelService
func NewLevelService() *LevelService {
	return &LevelService{
		Collection:     database.GetCollection(database.Client, "Level"), // Подключение к коллекции "Levels"
		UnitCollection: database.GetCollection(database.Client, "Unit"),  // Подключение к коллекции "Levels"
	}
}

// Создание нового уровня
func (s *LevelService) CreateLevel(dto CreateLevelDTO) (*Level, error) {
	level := Level{
		ID:        primitive.NewObjectID(),
		Name:      dto.Name,
		Units:     nil, // Пустой список блоков при создании уровня
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	// Добавление уровня в базу данных
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
				{Key: "from", Value: "Unit"},             // Коллекция блоков
				{Key: "localField", Value: "_id"},        // Поле уровня для связи
				{Key: "foreignField", Value: "level_id"}, // Поле блока для связи
				{Key: "as", Value: "units"},              // Название поля с объединенными блоками
			}},
		},
	}

	// Выполняем агрегацию
	cursor, err := s.Collection.Aggregate(context.Background(), pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(context.Background())

	// Преобразуем курсор в слайс структур Level
	var levels []Level
	if err := cursor.All(context.Background(), &levels); err != nil {
		return nil, err
	}

	return levels, nil
}

// Удаление уровня
func (s *LevelService) DeleteLevel(levelID primitive.ObjectID) error {
	// Начало транзакции
	session, err := s.Collection.Database().Client().StartSession()
	if err != nil {
		return fmt.Errorf("failed to start session: %w", err)
	}
	defer session.EndSession(context.Background())

	err = mongo.WithSession(context.Background(), session, func(sc mongo.SessionContext) error {
		// Удаляем все Units, связанные с Level
		_, err = s.UnitCollection.DeleteMany(sc, bson.M{"level_id": levelID})
		if err != nil {
			abortErr := session.AbortTransaction(sc)
			if abortErr != nil {
				return fmt.Errorf("failed to abort transaction: %w (original error: %w)", abortErr, err)
			}
			return fmt.Errorf("failed to delete units: %w", err)
		}

		// Удаляем сам Level
		_, err = s.Collection.DeleteOne(sc, bson.M{"_id": levelID})
		if err != nil {
			abortErr := session.AbortTransaction(sc)
			if abortErr != nil {
				return fmt.Errorf("failed to abort transaction: %w (original error: %w)", abortErr, err)
			}
			return fmt.Errorf("failed to delete level: %w", err)
		}

		// Завершаем транзакцию
		return session.CommitTransaction(sc)
	})

	return err
}
