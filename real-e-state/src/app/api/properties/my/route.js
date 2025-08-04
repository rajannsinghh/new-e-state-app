import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import { jwtVerify } from 'jose';

export async function GET() {
  try {
    const token = cookies().get('token')?.value;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { payload } = await jwtVerify(
      new TextEncoder().encode(token),
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    await connectDB();
    const properties = await Property.find({ postedBy: payload.userId }).sort({ createdAt: -1 });

    return NextResponse.json({ properties });
  } catch (err) {
    console.error('GET /properties/my failed:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
