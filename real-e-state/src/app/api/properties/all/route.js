// src/app/api/properties/all/route.js

import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await connectDB();
    const properties = await Property.find({}).populate("postedBy", "email name");
    return NextResponse.json({ properties });
  } catch (err) {
    console.error('GET /api/properties/all error:', err);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
