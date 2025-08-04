
import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';

export async function GET(req, { params }) {
  await connectDB();

  const current = await Property.findById(params.id);
  if (!current) return new Response('Property not found', { status: 404 });

  const similar = await Property.find({
    location: current.location,
    _id: { $ne: current._id },
  }).limit(4);

  return Response.json({ similar });
}
