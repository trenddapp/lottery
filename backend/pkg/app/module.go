package app

import (
	"go.uber.org/fx"

	"github.com/dapp-z/lottery/backend/pkg/config"
	"github.com/dapp-z/lottery/backend/pkg/http"
)

var BaseModule = fx.Options(
	config.Module,
	http.Module,
)
