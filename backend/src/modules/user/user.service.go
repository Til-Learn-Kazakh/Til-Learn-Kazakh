package user

import (
	"context"
	"diploma/src/database"
	"diploma/src/modules/auth"
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

const (
	MaxHearts      = 5
	RefillInterval = 5 * time.Minute
	RefillCost     = 500
)

type UserService struct {
	Collection *mongo.Collection
}

func NewUserService() *UserService {
	return &UserService{
		Collection: database.GetCollection(database.Client, "User"),
	}
}

func (s *UserService) GetUserByID(userID string) (*auth.User, error) {
	objectID, err := primitive.ObjectIDFromHex(userID)
	if err != nil {
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pipeline := mongo.Pipeline{
		bson.D{{Key: "$match", Value: bson.M{"_id": objectID}}},
		bson.D{{Key: "$lookup", Value: bson.M{
			"from":         "Streak",
			"localField":   "_id",
			"foreignField": "userId",
			"as":           "streak",
		}}},
		bson.D{{Key: "$unwind", Value: bson.M{
			"path":                       "$streak",
			"preserveNullAndEmptyArrays": true,
		}}},
	}

	cursor, err := s.Collection.Aggregate(ctx, pipeline)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var user auth.User
	if cursor.Next(ctx) {
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
	} else {
		return nil, errors.New("user not found")
	}

	return &user, nil
}

// RefillHearts выполняет автоматическое восстановление сердец,
// исходя из времени, прошедшего с момента последнего refill.
func (s *UserService) RefillHearts(userID string) (*auth.User, error) {
	user, err := s.GetUserByID(userID)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	elapsed := now.Sub(user.LastRefillAt)

	if user.Hearts < MaxHearts {
		refillable := int(elapsed / RefillInterval)
		if refillable > 0 {
			user.Hearts += refillable
			if user.Hearts > MaxHearts {
				user.Hearts = MaxHearts
			}

			// Сколько "остатка" времени прошло с последнего целого интервала
			remaining := elapsed % RefillInterval
			user.LastRefillAt = now.Add(-remaining)

			_, err = s.Collection.UpdateOne(
				context.Background(),
				bson.M{"_id": user.ID},
				bson.M{
					"$set": bson.M{
						"hearts":         user.Hearts,
						"last_refill_at": user.LastRefillAt,
					},
				},
			)
			if err != nil {
				return nil, err
			}
		}
	}

	return user, nil
}

func (s *UserService) RefillHeartsWithCrystals(userID string) (*auth.User, error) {
	user, err := s.GetUserByID(userID)
	if err != nil {
		return nil, err
	}

	if user.Crystals < RefillCost {
		return nil, errors.New("not enough crystals")
	}
	if user.Hearts >= MaxHearts {
		return nil, errors.New("hearts are already full")
	}

	user.Crystals -= RefillCost
	user.Hearts = MaxHearts

	_, err = s.Collection.UpdateOne(
		context.Background(),
		bson.M{"_id": user.ID},
		bson.M{"$set": bson.M{"hearts": user.Hearts, "crystals": user.Crystals}},
	)
	if err != nil {
		return nil, err
	}

	return user, nil
}
