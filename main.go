package main

import (
	"log"
	"os"

	"github.com/prithvirajv06/ray-dot/internal/config"
	"github.com/prithvirajv06/ray-dot/internal/database"
	"github.com/prithvirajv06/ray-dot/internal/handlers"
	"github.com/prithvirajv06/ray-dot/internal/kafka"
	"github.com/prithvirajv06/ray-dot/internal/middleware"
	"github.com/prithvirajv06/ray-dot/internal/repository"
	"github.com/prithvirajv06/ray-dot/internal/services"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() { // Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Initialize configuration
	cfg := config.Load()

	// Initialize database
	db, err := database.Connect(cfg.MongoURI)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Initialize Kafka
	kafkaProducer, err := kafka.NewProducer(cfg.KafkaBrokers)
	if err != nil {
		log.Fatal("Failed to initialize Kafka producer:", err)
	}
	defer kafkaProducer.Close()

	kafkaConsumer, err := kafka.NewConsumer(cfg.KafkaBrokers, "user-service-group")
	if err != nil {
		log.Fatal("Failed to initialize Kafka consumer:", err)
	}
	defer kafkaConsumer.Close()

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)

	// Initialize services
	userService := services.NewUserService(userRepo, kafkaProducer)
	authService := services.NewAuthService(userRepo, cfg.JWTSecret)

	// Initialize handlers
	userHandler := handlers.NewUserHandler(userService)
	authHandler := handlers.NewAuthHandler(authService)

	// Start Kafka consumer in goroutine (only if Kafka is available)
	go func() {
		defer func() {
			if r := recover(); r != nil {
				log.Printf("Kafka consumer panic recovered: %v", r)
			}
		}()

		log.Println("Starting Kafka consumer...")
		if err := kafkaConsumer.StartConsuming([]string{"user-events"}, userService.HandleUserEvents); err != nil {
			log.Printf("Kafka consumer error: %v", err)
		}
	}()

	// Setup routes
	router := setupRoutes(userHandler, authHandler, cfg.JWTSecret)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := router.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}

func setupRoutes(userHandler *handlers.UserHandler, authHandler *handlers.AuthHandler, jwtSecret string) *gin.Engine {
	router := gin.Default()

	// Middleware
	router.Use(middleware.CORS())
	router.Use(middleware.RequestID())
	router.Use(middleware.Logger())
	router.Use(middleware.ErrorHandler())

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Auth routes
	auth := router.Group("/auth")
	{
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
		auth.POST("/refresh", authHandler.RefreshToken)
	}

	// Protected routes
	api := router.Group("/api/v1")
	api.Use(middleware.JWTAuth(jwtSecret))
	{
		// User routes
		users := api.Group("/users")
		{
			users.GET("", middleware.RequireRole("admin"), userHandler.GetAllUsers)
			users.GET("/:id", middleware.RequireRole("admin", "user"), userHandler.GetUser)
			users.PUT("/:id", middleware.RequireRole("admin", "user"), userHandler.UpdateUser)
			users.DELETE("/:id", middleware.RequireRole("admin"), userHandler.DeleteUser)
		}

		// Profile routes
		api.GET("/profile", userHandler.GetProfile)
		api.PUT("/profile", userHandler.UpdateProfile)
	}

	return router
}
