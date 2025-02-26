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

func NewImageService() *ImageService {
	return &ImageService{BasePath: "src/public"}
}

func (s *ImageService) SaveImage(folder string, file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	savePath := filepath.Join(s.BasePath, folder)
	savePath = filepath.Clean(savePath)

	if !strings.HasPrefix(savePath, filepath.Clean(s.BasePath)) {
		return "", fmt.Errorf("invalid directory path detected")
	}

	if err := os.MkdirAll(savePath, 0750); err != nil {
		return "", fmt.Errorf("failed to create directory: %w", err)
	}

	originalName := fileHeader.Filename
	cleanName := strings.ReplaceAll(originalName, " ", "_")

	filePath := filepath.Join(savePath, cleanName)
	filePath = filepath.Clean(filePath)

	if !strings.HasPrefix(filePath, filepath.Clean(s.BasePath)) {
		log.Println("Error: filePath is outside BasePath")
		return "", errors.New("invalid file path")
	}

	dst, err := os.Create(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to create file: %w", err)
	}
	defer dst.Close()

	_, err = io.Copy(dst, file)
	if err != nil {
		return "", fmt.Errorf("failed to save file: %w", err)
	}

	relativePath := strings.TrimPrefix(filePath, s.BasePath)
	relativePath = strings.TrimLeft(relativePath, "/\\")       // Убираем лишние `/`
	relativePath = fmt.Sprintf("/%s", relativePath)            // Добавляем `/` в начале
	relativePath = strings.ReplaceAll(relativePath, "\\", "/") // Для Windows/Linux

	return relativePath, nil
}

func (s *ImageService) SaveMultipleImages(folder string, files []*multipart.FileHeader, _ *multipart.Form) ([]string, error) {
	var savedPaths []string
	var err error

	for _, fileHeader := range files {
		var file multipart.File

		file, err = fileHeader.Open()
		if err != nil {
			return nil, fmt.Errorf("failed to open file %s: %w", fileHeader.Filename, err)
		}

		var savedPath string
		savedPath, err = s.SaveImage(folder, file, fileHeader)

		if closeErr := file.Close(); closeErr != nil {
			log.Printf("warning: failed to close file %s: %v", fileHeader.Filename, closeErr)
		}
		if err != nil {
			return nil, fmt.Errorf("failed to save file %s: %w", fileHeader.Filename, err)
		}

		savedPaths = append(savedPaths, savedPath)
	}

	return savedPaths, nil
}

func (*ImageService) DeleteImage(filePath string) error {
	fullPath := filepath.Clean(filepath.FromSlash(filePath))

	if !strings.HasPrefix(fullPath, "src/public") {
		return errors.New("invalid file path")
	}

	err := os.Remove(fullPath)
	if err != nil {
		if os.IsNotExist(err) {
			return nil
		}
		return fmt.Errorf("failed to delete file: %w", err)
	}

	return nil
}
