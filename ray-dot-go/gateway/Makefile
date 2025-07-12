.PHONY: build run test clean docker-up docker-down



# Variables
APP_NAME := github.com/prithvirajv06/ray-dot
GO_VERSION := 1.21

# Build the application
build:
	go build -o bin/$(APP_NAME) .

# Run the application
run:
	go run .

# Run tests
test:
	go test -v ./...

# Clean build artifacts
clean:
	rm -rf bin/

# Install dependencies
deps:
	go mod tidy
	go mod download

# Format code
fmt:
	go fmt ./...

# Lint code
lint:
	golangci-lint run

# Generate mock files
generate:
	go generate ./...

# Docker commands
docker-build:
	docker build -t $(APP_NAME) .

docker-run:
	docker run -p 8080:8080 $(APP_NAME)

docker-up:
	docker-compose up -d

docker-down:
	docker-compose down

docker-logs:
	docker-compose logs -f app

# Database migrations (if needed)
migrate-up:
	migrate -path ./migrations -database "$(MONGO_URI)" up

migrate-down:
	migrate -path ./migrations -database "$(MONGO_URI)" down

# Development helpers
dev:
	air # Live reload tool

# API documentation
docs:
	swag init

# Security scan
security:
	gosec ./...
