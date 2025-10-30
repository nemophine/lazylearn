import { NextResponse } from 'next/server';

import type { MissionCurrentResponse } from '../../../lib/types/missions';

const GOAL = 1_000_000;
const PROGRESS_START = 850_000;

function buildMissionResponse(): MissionCurrentResponse {
  const now = Date.now();
  const deadline = new Date(now + 3 * 24 * 60 * 60 * 1000);
  const progress =
    PROGRESS_START +
    Math.floor(((now / 1000) % 300) * 250); // playful incremental growth
  const clampedProgress = Math.min(progress, GOAL);
  const status = clampedProgress >= GOAL ? 'success' : 'active';

  return {
    mission: {
      id: 'mission-collect-books',
      title: 'รวมพลัง 1,000,000 แต้มหัวใจ',
      tagline: 'เปลี่ยนแรงบันดาลใจให้เป็นหนังสือชุดใหม่สำหรับห้องสมุดชุมชน',
      status,
      progress: clampedProgress,
      goal: GOAL,
      deadline: deadline.toISOString(),
      heartsRaised: clampedProgress,
      contributors: 4821,
      updatedAt: new Date(now).toISOString(),
      proofId: status === 'success' ? 'mission-collect-books-proof' : undefined,
    },
    meta: {
      cached: true,
      expiresInSeconds: 30,
    },
  };
}

export async function GET() {
  const payload = buildMissionResponse();

  return NextResponse.json(payload, {
    headers: {
      'Cache-Control': 's-maxage=30, stale-while-revalidate=300',
    },
  });
}
