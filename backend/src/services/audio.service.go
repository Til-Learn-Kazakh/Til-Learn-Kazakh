package services

import (
	"fmt"
	"io"
	"mime/multipart"
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
	return &AudioService{BasePath: "src/public"}
}

// ✅ Сохранение аудиофайла
func (s *AudioService) SaveAudio(folder string, file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	// Создание пути для сохранения файла
	if fileHeader == nil {
		return "", fmt.Errorf("fileHeader is nil")
	}
	savePath := filepath.Join(s.BasePath, folder)
	if err := os.MkdirAll(savePath, os.ModePerm); err != nil {
		return "", fmt.Errorf("failed to create directory: %w", err)
	}

	// Формирование полного пути для файла
	fileName := sanitizeFileName(fileHeader.Filename)
	fullPath := filepath.Join(savePath, fileName)

	// Создание файла на сервере
	dst, err := os.Create(fullPath)
	if err != nil {
		return "", fmt.Errorf("failed to create audio file: %w", err)
	}
	defer dst.Close()

	// Копирование содержимого
	if _, err = io.Copy(dst, file); err != nil {
		return "", fmt.Errorf("failed to save audio: %w", err)
	}

	// Возвращаем относительный путь для использования в API
	relativePath := strings.TrimPrefix(fullPath, "src/public")
	return "/" + strings.ReplaceAll(relativePath, "\\", "/"), nil
}

// ✅ Проверка существования аудиофайла
func (s *AudioService) GetAudioPath(fileName string) (string, error) {
	audioPath := filepath.Join(s.BasePath, sanitizeFileName(fileName))
	if _, err := os.Stat(audioPath); os.IsNotExist(err) {
		return "", fmt.Errorf("audio file not found: %s", fileName)
	}
	return audioPath, nil
}

// ✅ Отправка аудиофайла клиенту
func (s *AudioService) ServeAudioFile(w http.ResponseWriter, r *http.Request, filePath string) error {
	// Очистка пути и проверка безопасности
	cleanPath := filepath.Clean(filepath.Join(s.BasePath, filePath))
	if !strings.HasPrefix(cleanPath, s.BasePath) {
		return fmt.Errorf("access denied: %s", filePath)
	}

	// Проверка существования файла
	file, err := os.Open(cleanPath)
	if err != nil {
		return fmt.Errorf("failed to open audio file: %w", err)
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		return fmt.Errorf("failed to get file info: %w", err)
	}

	// Отправка аудиофайла клиенту
	w.Header().Set("Content-Type", "audio/mpeg")
	http.ServeContent(w, r, fileInfo.Name(), fileInfo.ModTime(), file)
	fmt.Printf("Serving audio file: %s (size: %d bytes)\n", fileInfo.Name(), fileInfo.Size())

	return nil
}

// ✅ Утилита для очистки имени файла
func sanitizeFileName(fileName string) string {
	// Удаление опасных символов
	return strings.ReplaceAll(filepath.Base(fileName), " ", "_")
}
