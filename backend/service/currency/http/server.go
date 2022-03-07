package http

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/dapp-z/lottery/backend/service/currency/clients/coinmarketcap"
)

type Server struct {
	clientCoinMarketCap coinmarketcap.Client
}

func NewServer(clientCoinMarketCap coinmarketcap.Client) *Server {
	return &Server{
		clientCoinMarketCap: clientCoinMarketCap,
	}
}

func (s *Server) GetConvertionRate(c *gin.Context) {
	symbol := c.Param("symbol")

	convertionRate, err := s.clientCoinMarketCap.GetConvertionRate(c, symbol)
	if err != nil {
		if err == coinmarketcap.ErrInvalidSymbol {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": "invalid symbol",
			})

			return
		}

		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "internal server error",
		})

		return
	}

	c.JSON(http.StatusOK, gin.H{
		"convertion_rate": convertionRate,
	})
}
