## Purpose-Driven Community Hub

LazyLearn now ships with a purpose-first Community Hub experience backed by a decoupled Express API.

### Frontend (Next.js)

```bash
npm install
npm run dev
```

- Hosts UI at `http://localhost:3000`
- Mission banner pulls from `/api/missions/current` mock while backend is under development
- Focus Mode state lives in `app/state/focus-mode-context.tsx`

### Backend (Express + Kysely)

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

- Serves REST API + Socket.IO on `http://localhost:4000`
- Depends on PostgreSQL and Redis instances (see `server/.env.example`)
- API documentation lives in `server/README.md`

### Suggested Dev Workflow

1. Run Postgres + Redis locally (Docker compose recommended)
2. Start backend with `npm run dev` inside `server/`
3. Start Next.js frontend from repo root
4. Point frontend environment variables (see `.env.example`) so that the client hits the Express service instead of the mock Next.js route
