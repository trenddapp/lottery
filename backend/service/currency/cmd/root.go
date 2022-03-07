package cmd

import (
	"log"

	"github.com/spf13/cobra"
)

var rootCmd = cobra.Command{
	Use: "root",
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		log.Fatalf("failed to execute command: %v", err)
	}
}
