package config

import (
	"os"

	"go.uber.org/config"
)

func NewYAML() (*config.YAML, error) {
	options := []config.YAMLOption{}
	paths := generatePaths("base")

	for _, path := range paths {
		if _, err := os.Stat(path); os.IsNotExist(err) {
			continue
		}

		options = append(options, config.File(path))
	}

	return config.NewYAML(options...)
}

func generatePaths(filenames ...string) []string {
	paths := []string{}

	for _, filename := range filenames {
		paths = append(
			paths,
			"/config/"+filename+".yaml",
			"./config/"+filename+".yaml",
		)
	}

	return paths
}
