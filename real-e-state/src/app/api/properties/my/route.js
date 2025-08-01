// /src/app/api/properties/my/route.js
import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const token = (await cookies().get('token'))?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();

    const myProperties = await Property.find({ postedBy: decoded.id }).sort({ createdAt: -1 });

    return NextResponse.json({ properties: myProperties });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch user properties' }, { status: 500 });
  }
}
