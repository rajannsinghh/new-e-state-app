import connectDB from '@/lib/db';
import OtpStore from '@/models/OtpStore';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  await connectDB();
  const { phone, otp } = await req.json();

  if (!phone || !otp) {
    return Response.json({ error: 'Phone and OTP are required' }, { status: 400 });
  }

  const otpEntry = await OtpStore.findOne({ phone });

  if (!otpEntry || otpEntry.expiresAt < new Date()) {
    return Response.json({ error: 'OTP expired or not found' }, { status: 400 });
  }

  const isMatch = await bcrypt.compare(otp, otpEntry.otpHash);
  if (!isMatch) {
    return Response.json({ error: 'Invalid OTP' }, { status: 400 });
  }

  const existingUser = await User.findOne({
    $or: [
      { email: otpEntry.data.email },
      { phone: otpEntry.phone }
    ]
  });
  if (existingUser) {
    return Response.json({ error: 'User already exists' }, { status: 400 });
  }

  // Create user
  const user = await User.create({
    name: otpEntry.data.name,
    email: otpEntry.data.email,
    phone: otpEntry.phone,
    password: otpEntry.data.password,
    isVerified: true
  });

  await OtpStore.deleteOne({ phone });

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return Response.json({
    message: 'OTP verified and user registered',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    }
  });
}
