import { NextResponse } from 'next/server';

import type { MissionProofResponse } from '../../../../lib/types/missions';

const FALLBACK_PROOF: MissionProofResponse = {
  proof: {
    id: 'mission-collect-books-proof',
    missionId: 'mission-collect-books',
    summary:
      'หนังสือวิชาคณิต วิทยาศาสตร์ และศิลปะจำนวน 1,200 เล่มถูกจัดส่งไปยังศูนย์การเรียนรู้ชุมชน 6 แห่งในภาคอีสาน พร้อมเวิร์กช็อปแนะแนวจากอาสาสมัคร 25 คน',
    deliveredOn: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    impactHighlights: [
      '1,200 เล่มพร้อมสื่อการสอนเสริมถูกจัดหมวดหมู่เรียบร้อย',
      'เยาวชน 380 คนได้ยืมหนังสือภายใน 48 ชั่วโมงแรก',
      'ห้องอ่านหนังสือใหม่พร้อมมุมโฟกัสสำหรับวัยรุ่นที่มีสมาธิสั้น',
    ],
    gallery: [
      'https://images.unsplash.com/photo-1521587760476-6c12a4b040da',
      'https://images.unsplash.com/photo-1516979187457-637abb4f9353',
    ],
    partner: 'มูลนิธิอ่านสร้างอนาคต',
  },
};

export async function GET() {
  return NextResponse.json(FALLBACK_PROOF, {
    headers: {
      'Cache-Control': 's-maxage=300, stale-while-revalidate=600',
    },
  });
}
