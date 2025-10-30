import { sql } from 'kysely';

import { config } from '../config';
import { getDb } from '../db/client';
import { getRedisClient } from './redisClient';

const MISSION_CACHE_KEY = 'mission:current';

export async function getCurrentMission() {
  const redis = await getRedisClient();
  const cached = await redis.get(MISSION_CACHE_KEY);
  if (cached) {
    return JSON.parse(cached);
  }

  const db = getDb();
  const mission = await db
    .selectFrom('missions')
    .selectAll()
    .where('status', '=', sql.lit('active'))
    .orWhere('status', '=', sql.lit('success'))
    .orderBy('updated_at', 'desc')
    .limit(1)
    .executeTakeFirst();

  if (!mission) {
    throw new Error('No mission configured');
  }

  const response = {
    mission: {
      id: mission.id,
      title: mission.title,
      tagline: mission.tagline,
      status: mission.status,
      goal: mission.goal,
      progress: mission.progress,
      deadline: mission.deadline.toISOString(),
      heartsRaised: mission.progress,
      contributors: await getMissionContributors(mission.id),
      updatedAt: mission.updated_at.toISOString(),
      proofId: mission.proof_id ?? undefined,
    },
    meta: {
      cached: false,
      expiresInSeconds: config.missionCacheTtl,
    },
  };

  await redis.set(MISSION_CACHE_KEY, JSON.stringify(response), {
    EX: config.missionCacheTtl,
  });

  return response;
}

async function getMissionContributors(missionId: string) {
  const db = getDb();
  const result = await db
    .selectFrom('impact_events')
    .select(({ fn }) => fn.count('id').as('count'))
    .where('mission_id', '=', missionId)
    .where('type', '=', 'heart')
    .executeTakeFirst();

  return Number(result?.count ?? 0);
}

export async function getMissionProof(proofId: string) {
  const db = getDb();
  const proof = await db
    .selectFrom('mission_proofs')
    .selectAll()
    .where('id', '=', proofId)
    .executeTakeFirst();

  if (!proof) {
    return null;
  }

  return {
    proof: {
      id: proof.id,
      missionId: proof.mission_id,
      summary: proof.summary,
      deliveredOn: proof.delivered_on.toISOString(),
      impactHighlights: proof.highlights,
      gallery: proof.gallery,
      partner: proof.partner,
    },
  };
}
