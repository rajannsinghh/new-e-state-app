
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return Response.json({ error: 'Email and OTP are required' }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ email });

  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  if (user.isVerified) {
    return Response.json({ error: 'User already verified' }, { status: 400 });
  }

  if (user.otp !== otp) {
    return Response.json({ error: 'Invalid OTP' }, { status: 400 });
  }

  user.isVerified = true;
  user.otp = null;
  await user.save();

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return Response.json({
    message: 'Email verified successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
