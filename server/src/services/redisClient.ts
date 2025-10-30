import { createClient, type RedisClientType } from 'redis';

import { config } from '../config';

let redisClient: RedisClientType | null = null;

export async function getRedisClient() {
  if (redisClient) return redisClient;

  redisClient = createClient({ url: config.redisUrl });
  redisClient.on('error', (err) => {
    console.error('Redis error', err);
  });

  await redisClient.connect();
  return redisClient;
}

export async function disconnectRedis() {
  if (!redisClient) return;
  await redisClient.disconnect();
  redisClient = null;
}
