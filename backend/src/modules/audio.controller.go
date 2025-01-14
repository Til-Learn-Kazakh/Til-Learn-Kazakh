package modules

import (
	"net/http"

	"diploma/src/services"

	"github.com/gin-gonic/gin"
)

type AudioController struct {
	AudioService *services.AudioService
}

func NewAudioController(audioService *services.AudioService) *AudioController {
	return &AudioController{AudioService: audioService}
}

// Эндпоинт для получения и отправки аудиофайла
func (ctrl *AudioController) PlayAudio(c *gin.Context) {
	fileName := c.Param("fileName")

	audioPath, err := ctrl.AudioService.GetAudioPath(fileName)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Audio file not found"})
		return
	}

	err = ctrl.AudioService.ServeAudioFile(c.Writer, c.Request, audioPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to serve audio file"})
	}
}
