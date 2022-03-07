package coinmarketcap

import "context"

type Client interface {
	GetConvertionRate(ctx context.Context, symbol string) (float64, error)
}
