import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const isAdmin = email === process.env.MAIL_USER;
    const role = user.role || (isAdmin ? 'admin' : 'user');

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response first
    const res = new NextResponse(
      JSON.stringify({
        message: 'Login successful',
        user: {
          name: user.name,
          email: user.email,
          role,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

    // Then set cookie
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return res;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
