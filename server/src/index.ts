import http from 'http';

import { config } from './config';
import { createApp } from './app';
import { createDb } from './db/client';
import { getRedisClient } from './services/redisClient';
import { createSocketServer } from './websocket/server';

async function bootstrap() {
  try {
    await Promise.all([createDb(), getRedisClient()]);

    const app = createApp();
    const httpServer = http.createServer(app);
    await createSocketServer(httpServer);

    httpServer.listen(config.port, () => {
      console.log(`Community Hub API listening on port ${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

void bootstrap();
