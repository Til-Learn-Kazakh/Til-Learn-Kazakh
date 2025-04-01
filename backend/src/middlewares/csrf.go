package middlewares

import (
	"os"

	"github.com/gin-gonic/gin"
	csrf "github.com/utrack/gin-csrf"
)

func CSRFMiddleware() gin.HandlerFunc {
	secret := os.Getenv("CSRF_SECRET")
	if secret == "" {
		panic("❌ CSRF_SECRET не задан в .env файле")
	}

	return csrf.Middleware(csrf.Options{
		Secret:        secret,
		IgnoreMethods: []string{"GET", "HEAD", "OPTIONS"},
		ErrorFunc: func(c *gin.Context) {
			c.JSON(403, gin.H{"error": "❌ CSRF token mismatch"})
			c.Abort()
		},
	})
}
