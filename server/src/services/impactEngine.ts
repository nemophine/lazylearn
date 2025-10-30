import { getDb } from '../db/client';
import { getRedisClient } from './redisClient';

const HEART_PROGRESS_CHANNEL = 'mission:progress';
const GEM_EVENT_CHANNEL = 'user:gems';

interface ImpactEvent {
  userId: string;
  missionId?: string;
  type: 'heart' | 'gems';
  amount: number;
  metadata?: Record<string, unknown>;
}

export async function awardGems({
  userId,
  amount,
  metadata,
}: {
  userId: string;
  amount: number;
  metadata?: Record<string, unknown>;
}) {
  const db = getDb();
  await db
    .updateTable('users')
    .set(({ ref, add }) => ({
      gems: add(ref('gems'), amount),
    }))
    .where('id', '=', userId)
    .execute();

  await insertImpactEvent({
    userId,
    type: 'gems',
    amount,
    metadata,
  });

  const redis = await getRedisClient();
  await redis.publish(
    GEM_EVENT_CHANNEL,
    JSON.stringify({ userId, amount, metadata }),
  );
}

export async function addHeartsToMission({
  userId,
  missionId,
  amount,
  metadata,
}: {
  userId: string;
  missionId: string;
  amount: number;
  metadata?: Record<string, unknown>;
}) {
  const db = getDb();
  await db
    .updateTable('missions')
    .set(({ ref, add }) => ({
      progress: add(ref('progress'), amount),
      updated_at: new Date(),
    }))
    .where('id', '=', missionId)
    .execute();

  await insertImpactEvent({
    userId,
    missionId,
    type: 'heart',
    amount,
    metadata,
  });

  const redis = await getRedisClient();
  await redis.publish(
    HEART_PROGRESS_CHANNEL,
    JSON.stringify({ missionId, amount, metadata }),
  );
}

async function insertImpactEvent(event: ImpactEvent) {
  const db = getDb();
  await db
    .insertInto('impact_events')
    .values({
      user_id: event.userId,
      mission_id: event.missionId ?? null,
      type: event.type,
      amount: event.amount,
      metadata: event.metadata ?? {},
      created_at: new Date(),
    })
    .execute();
}
