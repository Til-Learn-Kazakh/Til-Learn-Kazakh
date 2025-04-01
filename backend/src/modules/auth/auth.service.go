package auth

import (
	"context"
	"errors"
	"log"
	"time"

	"diploma/src/database"
	"diploma/src/modules/streak"
	"diploma/src/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	UserCollection *mongo.Collection
	streakService  *streak.StreakService
}

func NewAuthService(streakService *streak.StreakService) *AuthService {
	return &AuthService{
		UserCollection: database.GetCollection(database.Client, "User"),
		streakService:  streakService,
	}
}

func HashPassword(password string) string {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Panic(err)
	}
	return string(bytes)
}

func VerifyPassword(inputPassword, userPassword string) (valid bool, msg string) {
	err := bcrypt.CompareHashAndPassword([]byte(userPassword), []byte(inputPassword))

	valid = true
	msg = ""
	if err != nil {
		msg = "Login or Password is incorrect"
		valid = false
	}
	return valid, msg
}

func (s *AuthService) Login(dto LoginDTO) (*User, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	emailHash := utils.GetEmailHash(dto.Email)

	var foundUser User
	err := s.UserCollection.FindOne(ctx, bson.M{"email_hash": emailHash}).Decode(&foundUser)
	if err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return nil, errors.New("user not found")
		}
		return nil, err
	}

	isValid, _ := VerifyPassword(dto.Password, foundUser.Password)
	if !isValid {
		return nil, errors.New("invalid credentials")
	}

	decryptedEmail, err := utils.Decrypt(foundUser.Email)
	if err == nil {
		foundUser.Email = decryptedEmail
	} else {
		// Если почему-то не удалось расшифровать,
		// либо можете вернуть foundUser.Email, либо вернуть ошибку
		log.Println("failed to decrypt email:", err)
	}
	return &foundUser, nil
}

func (s *AuthService) SignUp(dto SignUpDTO) (*User, error) {
	var ctx, cancel = context.WithTimeout(context.Background(), 100*time.Second)
	defer cancel()

	emailHash := utils.GetEmailHash(dto.Email)

	// Проверяем, нет ли уже пользователя с таким хэшем
	count, err := s.UserCollection.CountDocuments(ctx, bson.M{"email_hash": emailHash})
	if err != nil {
		return nil, err
	}
	if count > 0 {
		return nil, errors.New("user already exists")
	}
	encryptedEmail, err := utils.Encrypt(dto.Email)
	if err != nil {
		return nil, err
	}

	session, err := s.UserCollection.Database().Client().StartSession()
	if err != nil {
		return nil, err
	}
	defer session.EndSession(context.TODO())

	callback := func(mongo.SessionContext) (any, error) {
		hashedPassword := HashPassword(dto.Password)

		newUser := &User{
			ID:               primitive.NewObjectID(),
			FirstName:        dto.FirstName,
			LastName:         dto.LastName,
			Email:            encryptedEmail,
			EmailHash:        emailHash,
			Password:         hashedPassword,
			Hearts:           4,
			Crystals:         1000,
			LessonsCompleted: []primitive.ObjectID{},
			UserAchievements: []primitive.ObjectID{},
			PendingRewards:   []PendingReward{},
			CreatedAt:        time.Now(),
			UpdatedAt:        time.Now(),
			LastRefillAt:     time.Now(),
		}

		_, err = s.UserCollection.InsertOne(ctx, newUser)
		if err != nil {
			return nil, err
		}

		err = s.streakService.UpdateStreak(newUser.ID.Hex())
		if err != nil {
			return nil, err
		}

		return newUser, nil
	}

	result, err := session.WithTransaction(context.TODO(), callback)
	if err != nil {
		return nil, err
	}

	user, ok := result.(*User)
	if !ok {
		return nil, errors.New("failed to cast result to *User")
	}

	return user, nil
}
