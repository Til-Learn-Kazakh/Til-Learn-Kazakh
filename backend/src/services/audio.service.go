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

func NewAudioService() *AudioService {
	return &AudioService{BasePath: "src/public"}
}

func (s *AudioService) SaveAudio(folder string, file multipart.File, fileHeader *multipart.FileHeader) (string, error) {
	if fileHeader == nil {
		return "", fmt.Errorf("fileHeader is nil")
	}
	savePath := filepath.Join(s.BasePath, folder)
	if err := os.MkdirAll(savePath, 0750); err != nil {
		return "", fmt.Errorf("failed to create directory: %w", err)
	}

	fileName := sanitizeFileName(fileHeader.Filename)
	fullPath := filepath.Join(savePath, fileName)

	if !strings.HasPrefix(filepath.Clean(fullPath), filepath.Clean(savePath)) {
		return "", fmt.Errorf("invalid file path detected")
	}

	dst, err := os.Create(fullPath)
	if err != nil {
		return "", fmt.Errorf("failed to create audio file: %w", err)
	}
	defer dst.Close()

	if _, err = io.Copy(dst, file); err != nil {
		return "", fmt.Errorf("failed to save audio: %w", err)
	}

	relativePath := strings.TrimPrefix(fullPath, "src/public")
	return "/" + strings.ReplaceAll(relativePath, "\\", "/"), nil
}

func (s *AudioService) GetAudioPath(fileName string) (string, error) {
	audioPath := filepath.Join(s.BasePath, sanitizeFileName(fileName))
	if _, err := os.Stat(audioPath); os.IsNotExist(err) {
		return "", fmt.Errorf("audio file not found: %s", fileName)
	}
	return audioPath, nil
}

func (s *AudioService) ServeAudioFile(w http.ResponseWriter, r *http.Request, filePath string) error {
	cleanPath := filepath.Clean(filepath.Join(s.BasePath, filePath))
	if !strings.HasPrefix(cleanPath, s.BasePath) {
		return fmt.Errorf("access denied: %s", filePath)
	}

	file, err := os.Open(cleanPath)
	if err != nil {
		return fmt.Errorf("failed to open audio file: %w", err)
	}
	defer file.Close()

	fileInfo, err := file.Stat()
	if err != nil {
		return fmt.Errorf("failed to get file info: %w", err)
	}

	w.Header().Set("Content-Type", "audio/mpeg")
	http.ServeContent(w, r, fileInfo.Name(), fileInfo.ModTime(), file)
	fmt.Printf("Serving audio file: %s (size: %d bytes)\n", fileInfo.Name(), fileInfo.Size())

	return nil
}

func sanitizeFileName(fileName string) string {
	return strings.ReplaceAll(filepath.Base(fileName), " ", "_")
}
