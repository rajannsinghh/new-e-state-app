import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file'); // expects a file input with name="file"

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const stream = cloudinary.uploader.upload_stream({ folder: 'e-state' }, (error, result) => {
    if (error) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
  });

  Readable.from(buffer).pipe(stream);

  return new Promise((resolve) => {
    stream.on('finish', () => {
      resolve(NextResponse.json({ url: stream.url }));
    });
  });
}
