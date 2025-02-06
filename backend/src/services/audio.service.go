package services

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
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
func (s *AudioService) ServeAudioFile(w http.ResponseWriter, r *http.Request, filePath string) error {
	// Очистка пути от потенциально вредных символов
	cleanPath := filepath.Clean(filePath)

	// Вычисляем относительный путь от BasePath до cleanPath
	relPath, err := filepath.Rel(s.BasePath, cleanPath)
	if err != nil || relPath == ".." || strings.HasPrefix(relPath, "..") {
		return fmt.Errorf("access denied: %s", filePath)
	}

	// Создаем полный путь
	fullPath := filepath.Join(s.BasePath, relPath)

	file, err := os.Open(fullPath)
	if err != nil {
		return err
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		return err
	}

	fmt.Printf("Serving audio file: %s (size: %d bytes)\n", fileInfo.Name(), fileInfo.Size())

	fileName := filepath.Base(fullPath)

	w.Header().Set("Content-Type", "audio/mpeg")
	http.ServeContent(w, r, fileName, fileInfo.ModTime(), file)
	return nil
}
