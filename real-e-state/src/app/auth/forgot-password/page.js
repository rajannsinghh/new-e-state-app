import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { generateOTP } from '@/utils/generateOTP';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ error: 'Email is required' }, { status: 400 });

  await connectDB();
  const user = await User.findOne({ email });

  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const otp = generateOTP();
  user.otp = otp;
  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"E-State" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Password OTP',
    html: `<p>Your OTP to reset your password is <b>${otp}</b>. It expires in 10 minutes.</p>`,
  });

  return NextResponse.json({ message: 'OTP sent to your email.' });
}
