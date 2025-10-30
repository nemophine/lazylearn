import { Router } from 'express';
import { z } from 'zod';

import { getDb } from '../db/client';
import { getRedisClient } from '../services/redisClient';

const createClubSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(1),
  createdBy: z.string(),
});

const createMessageSchema = z.object({
  senderId: z.string(),
  body: z.string().min(1),
});

export function createClubsRouter() {
  const router = Router();

  router.get('/', async (_req, res, next) => {
    try {
      const db = getDb();
      const clubs = await db
        .selectFrom('clubs')
        .selectAll()
        .orderBy('created_at', 'desc')
        .execute();
      res.json({ clubs });
    } catch (error) {
      next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const payload = createClubSchema.parse(req.body);
      const db = getDb();
      const [club] = await db
        .insertInto('clubs')
        .values({
          name: payload.name,
          description: payload.description,
          created_by: payload.createdBy,
          created_at: new Date(),
        })
        .returningAll()
        .execute();
      res.status(201).json({ club });
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const db = getDb();
      const club = await db
        .selectFrom('clubs')
        .selectAll()
        .where('id', '=', req.params.id)
        .executeTakeFirst();

      if (!club) {
        res.status(404).json({ message: 'Club not found' });
        return;
      }

      const members = await db
        .selectFrom('club_members')
        .innerJoin('users', 'users.id', 'club_members.user_id')
        .select(['users.id as userId', 'users.display_name as displayName', 'club_members.joined_at as joinedAt'])
        .where('club_members.club_id', '=', req.params.id)
        .execute();

      res.json({ club, members });
    } catch (error) {
      next(error);
    }
  });

  router.get('/:id/messages', async (req, res, next) => {
    try {
      const { cursor, limit = '30' } = req.query;
      const limitNumber = Math.min(100, Number(limit) || 30);
      const db = getDb();

      let query = db
        .selectFrom('club_messages')
        .selectAll()
        .where('club_id', '=', req.params.id)
        .orderBy('created_at', 'desc')
        .limit(limitNumber);

      if (cursor && typeof cursor === 'string') {
        query = query.where('created_at', '<', new Date(cursor));
      }

      const rows = await query.execute();
      const messages = rows.reverse();
      const nextCursor = messages.length ? messages[0].created_at.toISOString() : null;

      res.json({ messages, nextCursor });
    } catch (error) {
      next(error);
    }
  });

  router.post('/:id/messages', async (req, res, next) => {
    try {
      const payload = createMessageSchema.parse(req.body);
      const db = getDb();
      const [message] = await db
        .insertInto('club_messages')
        .values({
          club_id: req.params.id,
          sender_id: payload.senderId,
          body: payload.body,
          created_at: new Date(),
        })
        .returningAll()
        .execute();

      const redis = await getRedisClient();
      await redis.publish(
        `chat:${req.params.id}`,
        JSON.stringify({
          type: 'club:message',
          payload: {
            id: message.id,
            clubId: message.club_id,
            senderId: message.sender_id,
            body: message.body,
            createdAt: message.created_at,
          },
        }),
      );

      res.status(201).json({ message });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
