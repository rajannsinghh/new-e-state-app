import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const properties = await Property.find({ approved: true }).sort({ createdAt: -1 });
    return NextResponse.json({ properties });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
