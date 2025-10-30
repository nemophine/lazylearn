import 'dotenv/config';

const REQUIRED_ENV = ['DATABASE_URL', 'REDIS_URL'] as const;

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  redisUrl: process.env.REDIS_URL ?? '',
  missionCacheTtl: Number(process.env.MISSION_CACHE_TTL ?? 30),
};
