import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import { getUserFromToken } from '@/lib/getUserFromToken'; // helper to decode JWT from cookies

export async function GET(req) {
  await connectDB();

  const user = await getUserFromToken();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const properties = await Property.find({ postedBy: user._id }).sort({ createdAt: -1 });

  return new Response(JSON.stringify(properties), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
