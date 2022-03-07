package app

import (
	"go.uber.org/fx"

	"github.com/dapp-z/lottery/backend/pkg/app"
	clientcoinmarketcap "github.com/dapp-z/lottery/backend/service/currency/clients/coinmarketcap"
	"github.com/dapp-z/lottery/backend/service/currency/http"
)

var BaseModule = fx.Options(
	app.BaseModule,
	clientcoinmarketcap.Module,
	http.Module,
)
