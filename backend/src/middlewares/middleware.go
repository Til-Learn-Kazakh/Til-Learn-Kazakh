package middlewares

import (
	"net/http"

	"diploma/src/tokens"

	"github.com/gin-gonic/gin"
)

func Authentication() gin.HandlerFunc {
	return func(c *gin.Context) {
		ClientToken := c.Request.Header.Get("Authorization")
		if ClientToken == "" {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "No authorization header provided"})
			c.Abort()
			return
		}
		claims, err := tokens.ValidateToken(ClientToken)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"erorr": err})
			c.Abort()
			return
		}
		c.Set("email", claims.Email)
		c.Set("uid", claims.Uid)
		c.Next()
	}
}
