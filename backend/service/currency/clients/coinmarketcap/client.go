package coinmarketcap

import (
	"context"
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"strings"
)

const (
	URL = "https://pro-api.coinmarketcap.com"
)

var (
	ErrInvalidSymbol = errors.New("invalid symbol")
	ErrUnknown       = errors.New("unknown error")
)

type client struct {
	apiKey     string
	httpClient *http.Client
}

// NewClient returns a client that implements the Client interface.
func NewClient(cfg *Config) Client {
	return &client{
		apiKey:     cfg.APIKey,
		httpClient: http.DefaultClient,
	}
}

// GetConvertionRate returns a convertion rate for a given symbol.
// The symbol should be capitalized and separated with a hyphen. Ex. ETH-USD, USD-ETH, BTC-ETH
func (c *client) GetConvertionRate(ctx context.Context, symbol string) (float64, error) {
	symbols := strings.Split(symbol, "-")
	if len(symbols) != 2 {
		return 0, ErrInvalidSymbol
	}

	request, err := http.NewRequestWithContext(ctx, http.MethodGet, URL+"/v2/tools/price-conversion", nil)
	if err != nil {
		return 0, err
	}

	query := request.URL.Query()
	query.Add("amount", "1")
	query.Add("symbol", symbols[0])
	query.Add("convert", symbols[1])
	request.URL.RawQuery = query.Encode()
	request.Header.Add("X-CMC_PRO_API_KEY", c.apiKey)

	response, err := c.httpClient.Do(request)
	if err != nil {
		return 0, err
	}

	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		return 0, ErrUnknown
	}

	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return 0, err
	}

	var result struct {
		Data []struct {
			Quote map[string]struct {
				Price float64 `json:"price"`
			} `json:"quote"`
		} `json:"data"`
	}

	if err := json.Unmarshal(body, &result); err != nil {
		return 0, err
	}

	if len(result.Data) == 0 {
		return 0, ErrUnknown
	}

	quote, ok := result.Data[0].Quote[symbols[1]]
	if !ok {
		return 0, ErrInvalidSymbol
	}

	return quote.Price, nil
}
