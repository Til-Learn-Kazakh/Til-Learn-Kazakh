package middlewares

import "github.com/gin-gonic/gin"

func SecureHeaders() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Защита от MIME-тип sniffing
		c.Writer.Header().Set("X-Content-Type-Options", "nosniff")

		// Защита от XSS в старых браузерах
		c.Writer.Header().Set("X-XSS-Protection", "1; mode=block")

		// Запрет на отображение сайта в iframe (кликджекинг)
		c.Writer.Header().Set("X-Frame-Options", "DENY")

		// Пример Content-Security-Policy (если отдаёшь HTML или хочешь базовую защиту)
		// c.Writer.Header().Set("Content-Security-Policy", "default-src 'self'")

		// Strict Transport Security (если используешь HTTPS)
		// c.Writer.Header().Set("Strict-Transport-Security", "max-age=63072000; includeSubDomains")

		c.Next()
	}
}
