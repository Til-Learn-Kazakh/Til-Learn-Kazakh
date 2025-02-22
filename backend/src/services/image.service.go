package services

import (
	"errors"
	"fmt"
	"io"
	"log"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
)

type ImageService struct {
	BasePath string
}

// Конструктор для ImageService
func NewImageService() *ImageService {
	return &ImageService{BasePath: "src/public"}
}

func (s *ImageService) SaveImage(folder string, file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	// Создаем папку для сохранения файлов
	savePath := filepath.Join(s.BasePath, folder)
	savePath = filepath.Clean(savePath)

	// Логируем пути для отладки
	log.Printf("BasePath: %s, savePath: %s", s.BasePath, savePath)

	// Проверяем, что путь внутри `BasePath`
	if !strings.HasPrefix(savePath, filepath.Clean(s.BasePath)) {
		log.Println("Error: savePath is outside BasePath")
		return "", errors.New("invalid folder path")
	}

	// Создаем папку, если её нет
	err := os.MkdirAll(savePath, 0750)
	if err != nil {
		return "", fmt.Errorf("failed to create directory: %w", err)
	}

	// Оригинальное имя файла
	originalName := fileHeader.Filename
	cleanName := strings.ReplaceAll(originalName, " ", "_")

	// Полный путь к файлу
	filePath := filepath.Join(savePath, cleanName)
	filePath = filepath.Clean(filePath)

	// Проверяем, что `filePath` находится внутри `BasePath`
	if !strings.HasPrefix(filePath, filepath.Clean(s.BasePath)) {
		log.Println("Error: filePath is outside BasePath")
		return "", errors.New("invalid file path")
	}

	// Создаем файл
	dst, err := os.Create(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to create file: %w", err)
	}
	defer dst.Close()

	// Копируем содержимое файла
	_, err = io.Copy(dst, file)
	if err != nil {
		return "", fmt.Errorf("failed to save file: %w", err)
	}

	// Получаем **относительный путь** (удаляем `s.BasePath`)
	relativePath := strings.TrimPrefix(filePath, s.BasePath)
	relativePath = strings.TrimLeft(relativePath, "/\\")       // Убираем лишние `/`
	relativePath = fmt.Sprintf("/%s", relativePath)            // Добавляем `/` в начале
	relativePath = strings.ReplaceAll(relativePath, "\\", "/") // Для Windows/Linux

	log.Printf("Saved image at: %s", relativePath)
	return relativePath, nil
}

func (s *ImageService) SaveMultipleImages(folder string, files []*multipart.FileHeader, _ *multipart.Form) ([]string, error) {
	var savedPaths []string

	for _, fileHeader := range files {
		file, err := fileHeader.Open()
		if err != nil {
			return nil, fmt.Errorf("failed to open file %s: %w", fileHeader.Filename, err)
		}

		// Сохраняем каждое изображение
		savedPath, err := s.SaveImage(folder, file, fileHeader)
		file.Close() // Явное закрытие файла

		if err != nil {
			return nil, fmt.Errorf("failed to save file %s: %w", fileHeader.Filename, err)
		}
		savedPaths = append(savedPaths, savedPath)
	}

	return savedPaths, nil
}

// Удаление изображения
func (*ImageService) DeleteImage(filePath string) error {
	// Преобразуем путь в формат ОС
	fullPath := filepath.Clean(filepath.FromSlash(filePath))

	// Проверяем, что путь безопасен
	if !strings.HasPrefix(fullPath, "src/public") {
		return errors.New("invalid file path")
	}

	// Удаляем файл
	err := os.Remove(fullPath)
	if err != nil {
		if os.IsNotExist(err) {
			// Если файл уже не существует, игнорируем ошибку
			return nil
		}
		return fmt.Errorf("failed to delete file: %w", err)
	}

	return nil
}
