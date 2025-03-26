package achievements

import "go.mongodb.org/mongo-driver/bson/primitive"

type AchievementProgress struct {
	AchievementID primitive.ObjectID `json:"achievement_id"`
	Title         string             `json:"title"`
	Description   string             `json:"description"`
	Current       int                `json:"current"`
	Threshold     int                `json:"threshold"`
	IsAchieved    bool               `json:"is_achieved"`
	ImageURL      string             `json:"image_url"`
}
