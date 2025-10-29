import { Router } from 'express';
import { z } from 'zod';

import { getCurrentMission, getMissionProof } from '../services/missionsService';
import { addHeartsToMission } from '../services/impactEngine';

const videoWatchedSchema = z.object({
  userId: z.string(),
  missionId: z.string(),
  durationSeconds: z.number().positive(),
});

export function createMissionsRouter() {
  const router = Router();

  router.get('/current', async (_req, res, next) => {
    try {
      const payload = await getCurrentMission();
      res.json(payload);
    } catch (error) {
      next(error);
    }
  });

  router.get('/proof/:id', async (req, res, next) => {
    try {
      const proof = await getMissionProof(req.params.id);
      if (!proof) {
        res.status(404).json({ message: 'Proof not found' });
        return;
      }
      res.json(proof);
    } catch (error) {
      next(error);
    }
  });

  router.post('/events/video_watched', async (req, res, next) => {
    try {
      const payload = videoWatchedSchema.parse(req.body);
      const hearts = Math.ceil(payload.durationSeconds / 60);

      await addHeartsToMission({
        userId: payload.userId,
        missionId: payload.missionId,
        amount: hearts,
        metadata: { event: 'video_watched', duration: payload.durationSeconds },
      });

      res.status(202).json({ heartsAwarded: hearts });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
