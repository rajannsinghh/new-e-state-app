import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();

  // Clear the token by setting it expired
  cookieStore.set({
    name: 'token',
    value: '',
    path: '/',
    httpOnly: true,
    expires: new Date(0), // Expired
  });

  return NextResponse.json({ message: 'Logged out successfully' });
}
