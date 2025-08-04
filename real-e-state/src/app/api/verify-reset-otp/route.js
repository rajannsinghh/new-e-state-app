import { connectDB } from '@/lib/db';
import { Otp } from '@/models/Otp';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    await connectDB();

    const record = await Otp.findOne({ email });

    if (!record) {
      return NextResponse.json({ error: 'OTP not found. Please request a new one.' }, { status: 400 });
    }

    const isOtpMatch = await bcrypt.compare(otp, record.otpHash);
    if (!isOtpMatch) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }

    if (record.expiry < new Date()) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await Otp.deleteOne({ _id: record._id });

    return NextResponse.json({ message: 'Password reset successful! Redirecting to login...' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
