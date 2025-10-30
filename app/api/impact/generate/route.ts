import { NextResponse } from 'next/server';
import { heartPoints } from '../data';

export async function POST(request: Request) {
  const { amount } = await request.json();

  // Update the heart points value
  heartPoints.value += amount;

  return NextResponse.json({ success: true, heartPoints: heartPoints.value });
}
