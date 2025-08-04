import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { User } from '@/models/User';
import { connectDB } from './db';

export async function getUserFromToken() {
  await connectDB();
  const token = cookies().get('token')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
    const user = await User.findById(payload.id).select('-password');
    if (user?.isBlocked) return null;
    return user;
  } catch {
    return null;
  }
}
