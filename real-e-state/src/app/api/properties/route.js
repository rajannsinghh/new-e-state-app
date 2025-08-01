// src/app/api/properties/route.js
import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const location = searchParams.get('location');
    const min = searchParams.get('min');
    const max = searchParams.get('max');

    let query = { isApproved: true };

    if(search) query.$or = [{title: {$regex: search, $options: 'i'}},{location: {$regex: search, $options: 'i'}}]

    if (location) query.location = { $regex: location, $options: 'i' };

    if (min || max) query.price = {};
    if (min) query.price.$gte = parseInt(min);
    if (max) query.price.$lte = parseInt(max);

    const properties = await Property.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ properties });
  } catch (err) {
    console.error('Error in GET /api/properties:', err)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
