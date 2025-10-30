<<<<<<< HEAD
## Community Hub API

Purpose-driven backend service for the LazyLearn Community Hub. Implements the decoupled Node.js + Express layer, typed with Kysely, and wired for Redis-powered realtime updates.

### Stack

- Node.js + Express (TypeScript)
- PostgreSQL via Kysely
- Redis for caching, sessions, and pub/sub
- Socket.IO for club chat delivery
- Zod for payload validation

### Getting Started

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

This will launch the API on `http://localhost:4000` with hot reload.

### Environment Variables

| Variable | Description |
| --- | --- |
| `PORT` | Port the Express server listens on (default `4000`) |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `MISSION_CACHE_TTL` | Cache duration for mission snapshot (seconds) |

### API Overview

| Endpoint | Description |
| --- | --- |
| `GET /health` | Liveness probe |
| `GET /api/v1/forum/posts` | List forum posts (optional `?tag=` filter) |
| `POST /api/v1/forum/posts` | Create forum post |
| `GET /api/v1/forum/posts/:id` | Retrieve post + answers |
| `POST /api/v1/forum/posts/:id/answers` | Add answer |
| `PATCH /api/v1/forum/answers/:id/best` | Mark best answer (+50 gems via Impact Engine) |
| `GET /api/v1/clubs` | Browse clubs |
| `POST /api/v1/clubs` | Create club |
| `GET /api/v1/clubs/:id` | Club profile + members |
| `GET /api/v1/clubs/:id/messages` | Paginated message history |
| `POST /api/v1/clubs/:id/messages` | Persist + publish chat message |
| `GET /api/v1/missions/current` | Cached mission snapshot |
| `GET /api/v1/missions/proof/:id` | Proof-of-impact artifact |
| `POST /api/v1/missions/events/video_watched` | Adds Heart Points to mission |
| `POST /api/v1/store/buy/:itemId` | Deduct gems and log purchase |

### Realtime Chat

- WebSocket server (Socket.IO) co-hosted on the same HTTP server
- Clients emit `join` with `{ clubId, userId }` to subscribe
- Backend listens to Redis channels `chat:*` and broadcasts to room `club:{id}`

### Impact Engine

- `awardGems` updates user balances and publishes Redis event `user:gems`
- `addHeartsToMission` increments mission progress, logs impact events, and publishes `mission:progress`

### Database Schema Reference

See `src/types/database.ts` for the canonical table definitions consumed by Kysely.

### Development Notes

- The service depends on Postgres 14+ and Redis 6+
- Add Prisma/Kysely migrations separately (not included here)
- Tests and CI setup should lint (`npm run lint`) and run integration tests
=======
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
>>>>>>> schedule-feature
