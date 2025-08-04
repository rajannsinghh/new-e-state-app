// src/app/api/properties/approve/route.js

import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const token = cookies().get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Decode JWT properly with await
    const { payload: decoded } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    // Validate admin email (support for multiple if needed)
    const allowedAdmins = [process.env.MAIL_USER];
    if (!allowedAdmins.includes(decoded.email)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id, approve } = await req.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing property ID' }, { status: 400 });
    }

    await connectDB();

    if (approve) {
      const updated = await Property.findByIdAndUpdate(id, { isApproved: true }, { new: true });
      if (!updated) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Property approved', property: updated });
    } else {
      const deleted = await Property.findByIdAndDelete(id);
      if (!deleted) {
        return NextResponse.json({ error: 'Property not found' }, { status: 404 });
      }

      return NextResponse.json({ message: 'Property rejected and deleted' });
    }
  } catch (err) {
    console.error("Approve route error:", err);
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 500 });
  }
}
