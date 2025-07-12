package services

import (
	"context"
	"encoding/json"
	"log"

	"github.com/prithvirajv06/ray-dot/internal/kafka"
	"github.com/prithvirajv06/ray-dot/internal/models"
	"github.com/prithvirajv06/ray-dot/internal/repository"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"
)

type UserService struct {
	userRepo *repository.UserRepository
	kafka    *kafka.Producer
}

func NewUserService(userRepo *repository.UserRepository, kafka *kafka.Producer) *UserService {
	return &UserService{
		userRepo: userRepo,
		kafka:    kafka,
	}
}

func (s *UserService) CreateUser(ctx context.Context, req *models.CreateUserRequest) (*models.User, error) {
	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
		Role:     req.Role,
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	// Publish user created event
	s.publishUserEvent("user.created", user)

	return user, nil
}

func (s *UserService) GetUserByID(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
	return s.userRepo.GetByID(ctx, id)
}

func (s *UserService) GetAllUsers(ctx context.Context) ([]models.User, error) {
	return s.userRepo.GetAll(ctx)
}

func (s *UserService) UpdateUser(ctx context.Context, id primitive.ObjectID, req *models.UpdateUserRequest) (*models.User, error) {
	updates := bson.M{}

	if req.Username != "" {
		updates["username"] = req.Username
	}
	if req.Email != "" {
		updates["email"] = req.Email
	}
	if req.Role != "" {
		updates["role"] = req.Role
	}
	if req.Active != nil {
		updates["active"] = *req.Active
	}

	if err := s.userRepo.Update(ctx, id, updates); err != nil {
		return nil, err
	}

	user, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	// Publish user updated event
	s.publishUserEvent("user.updated", user)

	return user, nil
}

func (s *UserService) DeleteUser(ctx context.Context, id primitive.ObjectID) error {
	user, err := s.userRepo.GetByID(ctx, id)
	if err != nil {
		return err
	}

	if err := s.userRepo.Delete(ctx, id); err != nil {
		return err
	}

	// Publish user deleted event
	s.publishUserEvent("user.deleted", user)

	return nil
}

func (s *UserService) publishUserEvent(eventType string, user *models.User) {
	event := map[string]interface{}{
		"event_type": eventType,
		"user_id":    user.ID.Hex(),
		"username":   user.Username,
		"email":      user.Email,
		"role":       user.Role,
		"timestamp":  user.UpdatedAt,
	}

	if err := s.kafka.Publish("user-events", event); err != nil {
		log.Printf("Failed to publish user event: %v", err)
	}
}

func (s *UserService) HandleUserEvents(message []byte) error {
	var event map[string]interface{}
	if err := json.Unmarshal(message, &event); err != nil {
		return err
	}

	log.Printf("Processing user event: %s", event["event_type"])
	// Add your event processing logic here
	return nil
}
