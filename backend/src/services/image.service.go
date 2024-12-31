package services

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"
)

type ImageService struct {
	BasePath string
}

// Конструктор для ImageService
func NewImageService() *ImageService {
	// Базовый путь устанавливается по умолчанию
	return &ImageService{BasePath: "src/public"}
}

// Сохранение изображения
func (s *ImageService) SaveImage(folder string, file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	// Создаем папку, если она не существует
	savePath := filepath.Join(s.BasePath, folder)
	err := os.MkdirAll(savePath, os.ModePerm)
	if err != nil {
		return "", fmt.Errorf("failed to create directory: %w", err)
	}

	// Оригинальное имя файла
	originalName := fileHeader.Filename
	cleanName := strings.ReplaceAll(originalName, " ", "_") // Удаляем пробелы из имени файла

	// Полный путь к файлу
	filePath := filepath.Join(savePath, cleanName)

	// Проверяем, существует ли файл
	if _, err = os.Stat(filePath); err == nil {
		// Если файл существует, добавляем префикс времени, чтобы избежать конфликта имен
		newName := fmt.Sprintf("%d_%s", time.Now().Unix(), cleanName)
		filePath = filepath.Join(savePath, newName)
	}

	// Открываем файл для записи
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

	// Преобразуем путь в формат с прямыми слешами
	unixStylePath := strings.ReplaceAll(filePath, "\\", "/")

	return unixStylePath, nil
}

// Удаление изображения
func (*ImageService) DeleteImage(filePath string) error {
	// Преобразуем путь в формат ОС
	fullPath := filepath.FromSlash(filePath)

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
