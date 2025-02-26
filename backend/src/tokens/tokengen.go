package tokens

import (
	"errors"
	"log"
	"os"
	"time"

	"diploma/src/database"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/mongo"
)

type SignedDetails struct {
	Email     string
	FirstName string
	LastName  string
	Uid       string
	jwt.StandardClaims
}

var UserData *mongo.Collection = database.GetCollection(database.Client, "Users")

var SECRET_KEY = os.Getenv("SECRET_KEY")

func TokenGenerator(email, firstname, lastname, uid string) (signedtoken, signedrefreshtoken string, err error) {
	claims := &SignedDetails{
		Email:     email,
		FirstName: firstname,
		LastName:  lastname,
		Uid:       uid,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(24)).Unix(),
		},
	}

	refreshclaims := &SignedDetails{
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Local().Add(time.Hour * time.Duration(168)).Unix(),
		},
	}
	token, err := jwt.NewWithClaims(jwt.SigningMethodHS256, claims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		return "", "", err
	}
	refreshtoken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshclaims).SignedString([]byte(SECRET_KEY))
	if err != nil {
		log.Panic(err)
		return
	}
	return token, refreshtoken, err
}

func ValidateToken(signedtoken string) (*SignedDetails, error) {
	token, err := jwt.ParseWithClaims(signedtoken, &SignedDetails{}, func(_ *jwt.Token) (any, error) {
		return []byte(SECRET_KEY), nil
	})
	if err != nil {
		return nil, err
	}

	// Проверяем, что claims имеет правильный тип
	claims, ok := token.Claims.(*SignedDetails)
	if !ok {
		return nil, errors.New("the token is invalid")
	}

	// Проверяем срок действия токена
	if claims.ExpiresAt < time.Now().Local().Unix() {
		return nil, errors.New("token is already expired")
	}

	return claims, nil
}
