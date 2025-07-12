import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { generateOTP } from '@/utils/generateOTP';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { name, email, password } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 });
  }

  await connectDB();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'Email already registered' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateOTP();

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    otp,
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `E-State <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your email',
    html: `<p>Your OTP is <b>${otp}</b>. It will expire in 10 minutes.</p>`,
  });

  await transporter.sendMail({
    from: `E-State <${process.env.EMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject: 'New User Registration',
    text: `New user registered: ${email}`,
  });

  return NextResponse.json({ message: 'User registered. Check email for OTP.' });
}
