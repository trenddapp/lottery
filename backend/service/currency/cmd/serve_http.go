package cmd

import (
	"github.com/gin-gonic/gin"
	"github.com/spf13/cobra"
	"go.uber.org/fx"

	"github.com/dapp-z/lottery/backend/pkg/app"
)

var serveHTTPCmd = &cobra.Command{
	Use: "http",
	Run: func(cmd *cobra.Command, args []string) {
		fx.New(
			app.BaseModule,
			fx.Invoke(func(router *gin.Engine) {
				router.GET("/ping", func(ctx *gin.Context) {
					ctx.String(200, "pong \n")
				})
			}),
		).Run()
	},
}

func init() {
	serveCmd.AddCommand(serveHTTPCmd)
}
