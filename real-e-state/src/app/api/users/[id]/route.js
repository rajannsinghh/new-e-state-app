import connectDB from '@/lib/connectDB';
import User from '@/models/User';

export async function GET(req, { params }) {
  await connectDB();
  const user = await User.findById(params.id);
  return Response.json(user);
}

export async function PUT(req, { params }) {
  await connectDB();
  const body = await req.json();
  const updated = await User.findByIdAndUpdate(params.id, body, { new: true });
  return Response.json(updated);
}

export async function DELETE(req, { params }) {
  await connectDB();
  await User.findByIdAndDelete(params.id);
  return Response.json({ success: true });
}
