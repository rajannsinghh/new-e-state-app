import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email, otp, newPassword } = await req.json();

  if (!email || !otp || !newPassword) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  await connectDB();
  const user = await User.findOne({ email, otp });

  if (!user) {
    return NextResponse.json({ error: 'Invalid OTP or email' }, { status: 400 });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = ''; // clear OTP after use
  user.isVerified = true;
  await user.save();

  return NextResponse.json({ message: 'Password reset successfully.' });
}
