import { NextResponse } from 'next/server';
import { users } from '../data';

export async function POST(request: Request) {
  const { userId, amount } = await request.json();

  const user = users.find((u) => u.id === userId);

  if (user) {
    user.gems += amount;
    return NextResponse.json({ success: true, user });
  } else {
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  }
}
