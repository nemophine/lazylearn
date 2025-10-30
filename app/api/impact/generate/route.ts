import { NextResponse } from 'next/server';
import { heartPoints } from '../data';

export async function POST(request: Request) {
  const { amount } = await request.json();

  heartPoints += amount;

  return NextResponse.json({ success: true, heartPoints });
}
