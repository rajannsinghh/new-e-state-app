import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import { jwtVerify } from 'jose';

const getUserFromToken = async (req) => {
  const token = req.cookies.get('token')?.value;
  if (!token) return null;
  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );
  return payload;
};

export async function GET(req, { params }) {
  try {
    console.log("Fetching property with ID:", params.id);
    await connectDB();

    if (!params?.id) {
      return new Response(JSON.stringify({ error: 'Missing ID param' }), { status: 400 });
    }

    const property = await Property.findById(params.id).populate('postedBy', 'name email');
    if (!property) {
      return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 });
    }

    return Response.json({ property });
  } catch (err) {
    console.error('Error fetching property:', err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}


export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const user = await getUserFromToken(req);

  const property = await Property.findById(params.id);
  if (!property) return new Response('Not found', { status: 404 });

  const isOwner = property.postedBy.toString() === user.userId;
  const isAdmin = user.email === process.env.MAIL_USER;

  if (!isOwner && !isAdmin) {
    return new Response('Unauthorized', { status: 401 });
  }

  const updated = await Property.findByIdAndUpdate(params.id, body, { new: true });
  return Response.json(updated);
}

export async function DELETE(req, { params }) {
  await connectDB();
  const user = await getUserFromToken(req);

  const property = await Property.findById(params.id);
  if (!property) return new Response('Not found', { status: 404 });

  const isOwner = property.postedBy.toString() === user.userId;
  const isAdmin = user.email === process.env.MAIL_USER;

  if (!isOwner && !isAdmin) {
    return new Response('Unauthorized', { status: 401 });
  }

  await Property.findByIdAndDelete(params.id);
  return Response.json({ success: true });
}