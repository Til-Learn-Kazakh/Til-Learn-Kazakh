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
	if err != nil || strings.Contains(relPath, "..") {
		return fmt.Errorf("access denied: %s", filePath)
	}

	// Создаем абсолютный путь
	fullPath := filepath.Join(s.BasePath, relPath)

	// Проверяем, что fullPath действительно внутри BasePath
	absBasePath, err := filepath.Abs(s.BasePath)
	if err != nil {
		return fmt.Errorf("failed to resolve base path: %w", err)
	}

	absFullPath, err := filepath.Abs(fullPath)
	if err != nil {
		return fmt.Errorf("failed to resolve full path: %w", err)
	}

	// Дополнительно проверяем символические ссылки, чтобы избежать обхода через них
	realBasePath, err := filepath.EvalSymlinks(absBasePath)
	if err != nil {
		return fmt.Errorf("failed to evaluate symlink for base path: %w", err)
	}

	realFullPath, err := filepath.EvalSymlinks(absFullPath)
	if err != nil {
		return fmt.Errorf("failed to evaluate symlink for requested file: %w", err)
	}

	// Проверяем, что realFullPath начинается с realBasePath (чтобы предотвратить обход)
	if !strings.HasPrefix(realFullPath, realBasePath) {
		return fmt.Errorf("access denied: %s", filePath)
	}

	// Открываем файл (теперь полностью безопасно)
	file, err := os.Open(realFullPath)
	if err != nil {
		return err
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		return err
	}

	fmt.Printf("Serving audio file: %s (size: %d bytes)\n", fileInfo.Name(), fileInfo.Size())

	fileName := filepath.Base(realFullPath)

	w.Header().Set("Content-Type", "audio/mpeg")
	http.ServeContent(w, r, fileName, fileInfo.ModTime(), file)
	return nil
}
