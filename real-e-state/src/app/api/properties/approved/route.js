import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const token = cookies().get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.email !== process.env.OWNER_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, approve } = await req.json();
    await connectDB();

    if (!id) return NextResponse.json({ error: 'Missing property id' }, { status: 400 });

    if (approve) {
      await Property.findByIdAndUpdate(id, { isApproved: true });
      return NextResponse.json({ message: 'Property approved' });
    } else {
      await Property.findByIdAndDelete(id);
      return NextResponse.json({ message: 'Property rejected & deleted' });
    }
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 500 });
  }
}
