// /app/api/profile/avatar/route.js
import { NextResponse } from 'next/server';
import cloudinary from 'cloudinary';
import { getUserFromToken } from '@/lib/getUser'; // Your JWT auth helper
import User from '@/models/User'; // Your Mongoose User model
import dbConnect from '@/lib/dbConnect';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  await dbConnect();

  const user = await getUserFromToken(req);
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await req.formData();
  const file = data.get('avatar');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No image uploaded' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = file.type;
  const encoding = 'base64';
  const base64Data = buffer.toString('base64');
  const fileUri = `data:${mime};${encoding},${base64Data}`;

  try {
    const result = await cloudinary.v2.uploader.upload(fileUri, {
      folder: 'avatars',
      public_id: `user-${user._id}`,
      overwrite: true,
    });

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { avatar: result.secure_url },
      { new: true }
    );

    return NextResponse.json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
