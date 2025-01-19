package services

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
)

type AudioService struct {
	BasePath string
}

// Конструктор для AudioService
func NewAudioService() *AudioService {
	return &AudioService{BasePath: "src/public/voice"}
}

// Получение пути к аудиофайлу
func (s *AudioService) GetAudioPath(fileName string) (string, error) {
	audioPath := filepath.Join(s.BasePath, fileName)
	if _, err := os.Stat(audioPath); os.IsNotExist(err) {
		return "", fmt.Errorf("audio file not found: %s", fileName)
	}
	return audioPath, nil
}

// Отправка аудиофайла в HTTP ответ
func (_ *AudioService) ServeAudioFile(w http.ResponseWriter, r *http.Request, filePath string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		return err
	}

	fmt.Printf("Serving audio file: %s (size: %d bytes)\n", fileInfo.Name(), fileInfo.Size())

	// Имя файла для заголовка
	fileName := filepath.Base(filePath)

	// Установить заголовки и отдать контент
	w.Header().Set("Content-Type", "audio/mpeg")
	http.ServeContent(w, r, fileName, fileInfo.ModTime(), file)
	return nil
}
