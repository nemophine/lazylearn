import { Router } from 'express';
import { z } from 'zod';

import { getDb } from '../db/client';

const purchaseSchema = z.object({
  userId: z.string(),
});

export function createStoreRouter() {
  const router = Router();

  router.get('/', async (_req, res, next) => {
    try {
      const db = getDb();
      const items = await db
        .selectFrom('mission_proofs')
        .select(['id as itemId', 'summary as name'])
        .limit(0)
        .execute();

      res.json({ items });
    } catch (error) {
      next(error);
    }
  });

  router.post('/buy/:itemId', async (req, res, next) => {
    try {
      const payload = purchaseSchema.parse(req.body);
      const db = getDb();

      const item = await db
        .selectFrom('mission_proofs')
        .select(['id'])
        .where('id', '=', req.params.itemId)
        .executeTakeFirst();

      if (!item) {
        res.status(404).json({ message: 'Item not found' });
        return;
      }

      await db.transaction().execute(async (trx) => {
        const user = await trx
          .selectFrom('users')
          .select(['id', 'gems'])
          .where('id', '=', payload.userId)
          .forUpdate()
          .executeTakeFirst();

        if (!user) {
          throw new Error('User not found');
        }

        const cost = 120;
        if (user.gems < cost) {
          res.status(400).json({ message: 'Not enough gems' });
          return;
        }

        await trx
          .updateTable('users')
          .set(({ ref, add }) => ({
            gems: add(ref('gems'), -cost),
          }))
          .where('id', '=', user.id)
          .execute();

        await trx
          .insertInto('impact_events')
          .values({
            user_id: user.id,
            mission_id: null,
            type: 'gems',
            amount: -cost,
            metadata: { itemId: item.id, event: 'store_purchase' },
            created_at: new Date(),
          })
          .execute();
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
