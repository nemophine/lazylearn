# LazyLearn Backend API

Backend API server for LazyLearn application built with Node.js, Express, TypeScript, and PostgreSQL.

## Features

- ✅ User Authentication (Register, Login, Logout)
- ✅ JWT Token-based Authorization
- ✅ Password Hashing with bcrypt
- ✅ Request Validation with Joi
- ✅ Rate Limiting
- ✅ CORS Support
- ✅ Security Headers with Helmet
- ✅ PostgreSQL Database Integration
- ✅ TypeScript Support

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Health Check

- `GET /health` - Server health check

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/lazylearn_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

Create a PostgreSQL database and run the initialization script:

```bash
# Create database
createdb lazylearn_db

# Run initialization script
psql lazylearn_db < init.sql
```

### 4. Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

### 5. Production Build

```bash
npm run build
npm start
```

## API Usage Examples

### Register User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Login User

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get Current User

```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Project Structure

```
server/
├── src/
│   ├── controllers/      # API endpoint handlers
│   │   └── authController.ts
│   ├── middleware/       # Express middleware
│   │   └── auth.ts
│   ├── models/          # Database models
│   │   └── User.ts
│   ├── routes/          # API routes
│   │   └── auth.ts
│   ├── services/        # Business logic
│   │   └── authService.ts
│   ├── utils/           # Utility functions
│   │   └── validation.ts
│   ├── app.ts           # Express app setup
│   └── database.ts      # Database connection
├── package.json
├── tsconfig.json
├── .env.example
├── init.sql
└── README.md
```

## Test User

For testing, a sample user is created during database initialization:

- **Email:** test@example.com
- **Password:** password123

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT token authentication
- Request rate limiting
- Input validation and sanitization
- CORS protection
- Security headers with Helmet

## Error Handling

All API responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

Error responses:

```json
{
  "error": "Error description",
  "details": ["Additional error details"]
}
```

## License

MIT