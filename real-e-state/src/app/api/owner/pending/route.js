import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore.get('token'))?.value;

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();

    // Only allow owner
    if (decoded.email !== process.env.OWNER_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const properties = await Property.find({ approved: false }).populate('listedBy', 'email');
    return NextResponse.json({ properties });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
