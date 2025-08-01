import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/getUserFromToken';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const property = await Property.findById(params.id).populate('postedBy', 'name email');
    if (!property || !property.isApproved) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ property });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}
