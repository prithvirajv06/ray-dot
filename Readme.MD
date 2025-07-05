## Features

- 🔐 JWT Authentication with refresh tokens
- 👥 Role-based access control (RBAC)
- 🗄️ MongoDB integration with repository pattern
- 📨 Kafka producer/consumer for event-driven architecture
- 🔍 Request logging and tracing
- 🛡️ CORS middleware
- 📊 Health check endpoint
- 🐳 Docker support with docker-compose
- 🚀 Production-ready structure

## Project Structure

```
github.com/prithvirajv06/ray-dot/
├── cmd/
│   └── main.go
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── database/
│   │   └── mongo.go
│   ├── handlers/
│   │   ├── auth_handler.go
│   │   └── user_handler.go
│   ├── kafka/
│   │   ├── consumer.go
│   │   └── producer.go
│   ├── middleware/
│   │   ├── auth.go
│   │   ├── cors.go
│   │   ├── error_handler.go
│   │   ├── logger.go
│   │   └── request_id.go
│   ├── models/
│   │   ├── jwt.go
│   │   └── user.go
│   ├── repository/
│   │   └── user_repository.go
│   ├── services/
│   │   ├── auth_service.go
│   │   └── user_service.go
│   └── utils/
│       ├── response.go
│       └── validator.go
├── .env
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── go.mod
├── go.sum
├── Makefile
└── README.md
```

## Quick Start

### Prerequisites

- Go 1.21+
- MongoDB
- Kafka
- Redis (optional)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd github.com/prithvirajv06/ray-dot
```

2. Install dependencies:

```bash
make deps
```

3. Copy environment variables:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration

5. Start the services using Docker:

```bash
make docker-up
```

6. Run the application:

```bash
make run
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token

### Users (Protected)

- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get user by ID
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Profile (Protected)

- `GET /api/v1/profile` - Get current user profile
- `PUT /api/v1/profile` - Update current user profile

### Health Check

- `GET /health` - Health check endpoint

## Usage Examples

### Register a new user

```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123"
  }'
```

### Access protected endpoint

```bash
curl -X GET http://localhost:8080/api/v1/profile \
  -H "Authorization: Bearer <your-jwt-token>"
```

## Configuration

The application uses environment variables for configuration:

```env
MONGO_URI=mongodb://localhost:27017/microservice
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
KAFKA_BROKERS=localhost:9092
ENVIRONMENT=development
PORT=8080
```

## Development

### Running tests

```bash
make test
```

### Code formatting

```bash
make fmt
```

### Linting

```bash
make lint
```

### Live reload during development

```bash
make dev
```

## Docker Deployment

### Build and run with Docker

```bash
make docker-build
make docker-run
```

### Using docker-compose

```bash
make docker-up
```

## Architecture

This microservice follows clean architecture principles:

- **Handlers**: HTTP request handlers
- **Services**: Business logic layer
- **Repository**: Data access layer
- **Models**: Data structures and DTOs
- **Middleware**: HTTP middleware for cross-cutting concerns
- **Kafka**: Event-driven communication
- **Config**: Application configuration

## Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- CORS protection
- Request rate limiting (can be added)
- Input validation

## Monitoring and Logging

- Structured logging with request IDs
- Health check endpoint
- Error handling middleware
- Request/response logging

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
