import { NextResponse } from 'next/server';
import { cookies as getCookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';

//  User model import with overwrite-safe fallback
const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    otp: String,
    profileImage: String,
    phone: String,
    role: { type: String, default: 'user' },
  },
  { timestamps: true }
);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export async function GET() {
  try {
    const cookieStore = getCookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not defined in environment');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Connect to DB before querying models
    await connectDB();

    const user = await User.findById(decoded.userId).select('-password -otp');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const role = user.role || (user.email === process.env.MAIL_USER ? 'admin' : 'user');

    return NextResponse.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        phone: user.phone,
        role,
      },
    });
  } catch (err) {
    console.error('Auth Me Error:', err);
    return NextResponse.json(
      { error: err.message || 'Server error' },
      { status: 500 }
    );
  }
}
