import { NextResponse } from 'next/server';
import { heartPoints } from '../data';

export async function GET() {
  return NextResponse.json({ heartPoints });
}
