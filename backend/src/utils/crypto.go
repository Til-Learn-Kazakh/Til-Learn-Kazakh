package utils

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"io"
	"os"
)

// getKey возвращает 32-байтовый ключ из переменной окружения AES_SECRET
func getKey() ([]byte, error) {
	key := os.Getenv("AES_SECRET")
	if len(key) != 32 {
		return nil, errors.New("AES_SECRET must be 32 characters long")
	}
	return []byte(key), nil
}

// Encrypt шифрует строку text с помощью AES (CFB) и возвращает base64-кодированный шифртекст
func Encrypt(text string) (string, error) {
	key, err := getKey()
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	plaintext := []byte(text)
	ciphertext := make([]byte, aes.BlockSize+len(plaintext))

	// IV — первые aes.BlockSize байт зашифрованного сообщения
	iv := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return "", err
	}

	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], plaintext)

	return base64.StdEncoding.EncodeToString(ciphertext), nil
}

// Decrypt расшифровывает base64-кодированный шифртекст с использованием AES (CFB)
func Decrypt(cryptoText string) (string, error) {
	key, err := getKey()
	if err != nil {
		return "", err
	}

	ciphertext, err := base64.StdEncoding.DecodeString(cryptoText)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(key)
	if err != nil {
		return "", err
	}

	if len(ciphertext) < aes.BlockSize {
		return "", errors.New("ciphertext too short")
	}

	iv := ciphertext[:aes.BlockSize]
	ciphertext = ciphertext[aes.BlockSize:]

	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(ciphertext, ciphertext)

	return string(ciphertext), nil
}

// GetEmailHash возвращает SHA-256 хэш от email (в hex-формате)
func GetEmailHash(email string) string {
	h := sha256.New()
	h.Write([]byte(email))
	return hex.EncodeToString(h.Sum(nil))
}
