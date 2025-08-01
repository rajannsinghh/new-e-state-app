import jwt from 'jsonwebtoken';
import { User } from '@/models/User';
import { connectDB } from './db';

export async function getUserFromToken(token) {
  try {
    await connectDB();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    return user;
  } catch (err) {
    return null;
  }
}
