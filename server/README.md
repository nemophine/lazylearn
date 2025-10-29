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
