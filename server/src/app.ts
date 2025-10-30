import cors from 'cors';
import express from 'express';
import helmet from 'helmet';

import { createForumRouter } from './routes/forum';
import { createClubsRouter } from './routes/clubs';
import { createMissionsRouter } from './routes/missions';
import { createStoreRouter } from './routes/store';

export function createApp() {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    }),
  );
  app.use(cors());
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/v1/forum', createForumRouter());
  app.use('/api/v1/clubs', createClubsRouter());
  app.use('/api/v1/missions', createMissionsRouter());
  app.use('/api/v1/store', createStoreRouter());

  app.use(
    (
      error: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error(error);
      res.status(500).json({ message: error.message });
    },
  );

  return app;
}
