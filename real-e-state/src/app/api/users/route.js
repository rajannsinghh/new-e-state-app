import connectDB from '@/lib/connectDB';
import User from '@/models/User';

export async function GET() {
  await connectDB();
  const users = await User.find().select('-password');
  return Response.json(users);
}
