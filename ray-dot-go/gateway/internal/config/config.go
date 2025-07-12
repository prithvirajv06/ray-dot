package config

import (
	"os"
	"strings"
)

type Config struct {
	MongoURI     string
	JWTSecret    string
	KafkaBrokers []string
	Environment  string
}

func Load() *Config {
	return &Config{
		MongoURI:     getEnv("MONGO_URI", "mongodb://localhost:27017/microservice"),
		JWTSecret:    getEnv("JWT_SECRET", "your-super-secret-jwt-key"),
		KafkaBrokers: strings.Split(getEnv("KAFKA_BROKERS", "localhost:9092"), ","),
		Environment:  getEnv("ENVIRONMENT", "development"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
