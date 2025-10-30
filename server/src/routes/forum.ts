import { Router } from 'express';
import { z } from 'zod';

import { getDb } from '../db/client';
import { awardGems } from '../services/impactEngine';

const createPostSchema = z.object({
  authorId: z.string(),
  title: z.string().min(3),
  body: z.string().min(1),
  tags: z.array(z.string()).default([]),
});

const createAnswerSchema = z.object({
  authorId: z.string(),
  body: z.string().min(1),
});

const bestAnswerSchema = z.object({
  requesterId: z.string(),
});

export function createForumRouter() {
  const router = Router();

  router.get('/posts', async (req, res, next) => {
    try {
      const { tag } = req.query;
      const db = getDb();
      let query = db.selectFrom('forum_posts').selectAll().orderBy('created_at', 'desc');

      if (typeof tag === 'string') {
        query = query.where('tags', '@>', [tag]);
      }

      const posts = await query.execute();
      res.json({ posts });
    } catch (error) {
      next(error);
    }
  });

  router.post('/posts', async (req, res, next) => {
    try {
      const payload = createPostSchema.parse(req.body);
      const db = getDb();
      const [post] = await db
        .insertInto('forum_posts')
        .values({
          author_id: payload.authorId,
          title: payload.title,
          body: payload.body,
          tags: payload.tags,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returningAll()
        .execute();
      res.status(201).json({ post });
    } catch (error) {
      next(error);
    }
  });

  router.get('/posts/:id', async (req, res, next) => {
    try {
      const db = getDb();
      const post = await db
        .selectFrom('forum_posts')
        .selectAll()
        .where('id', '=', req.params.id)
        .executeTakeFirst();

      if (!post) {
        res.status(404).json({ message: 'Post not found' });
        return;
      }

      const answers = await db
        .selectFrom('forum_answers')
        .selectAll()
        .where('post_id', '=', req.params.id)
        .orderBy('is_best', 'desc')
        .orderBy('created_at', 'asc')
        .execute();

      res.json({ post, answers });
    } catch (error) {
      next(error);
    }
  });

  router.post('/posts/:id/answers', async (req, res, next) => {
    try {
      const payload = createAnswerSchema.parse(req.body);
      const db = getDb();

      const [answer] = await db
        .insertInto('forum_answers')
        .values({
          post_id: req.params.id,
          author_id: payload.authorId,
          body: payload.body,
          is_best: false,
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returningAll()
        .execute();

      res.status(201).json({ answer });
    } catch (error) {
      next(error);
    }
  });

  router.patch('/answers/:id/best', async (req, res, next) => {
    try {
      const payload = bestAnswerSchema.parse(req.body);
      const db = getDb();

      const answer = await db
        .selectFrom('forum_answers')
        .selectAll()
        .where('id', '=', req.params.id)
        .executeTakeFirst();

      if (!answer) {
        res.status(404).json({ message: 'Answer not found' });
        return;
      }

      const post = await db
        .selectFrom('forum_posts')
        .select('author_id')
        .where('id', '=', answer.post_id)
        .executeTakeFirst();

      if (!post || post.author_id !== payload.requesterId) {
        res.status(403).json({ message: 'Not authorized to mark best answer' });
        return;
      }

      await db
        .updateTable('forum_answers')
        .set({ is_best: false })
        .where('post_id', '=', answer.post_id)
        .execute();

      await db
        .updateTable('forum_answers')
        .set({ is_best: true, updated_at: new Date() })
        .where('id', '=', req.params.id)
        .execute();

      await awardGems({
        userId: answer.author_id,
        amount: 50,
        metadata: { reason: 'best_answer', postId: answer.post_id },
      });

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  });

  return router;
}
