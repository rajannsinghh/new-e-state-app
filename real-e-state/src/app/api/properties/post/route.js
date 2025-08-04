import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import { User } from '@/models/User';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const token = cookies().get('token')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();

    const {
      title, description, price, location,
      bedrooms, bathrooms, discountPrice,
      options, images, cover, alts
    } = await req.json();

    if (!title || !description || !price || !location || !images?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const property = await Property.create({
      title,
      description,
      price,
      location,
      bedrooms,
      bathrooms,
      discountPrice,
      options,
      images,
      cover,
      alts,
      postedBy: decoded.userId,
      isApproved: false,
    });

    // Send email to owner
    try {
      const user = await User.findById(decoded.userId);
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"E-State" <${process.env.MAIL_USER}>`,
        to: process.env.MAIL_USER,
        subject: 'New Property Submission',
        html: `<p>${user?.name} has submitted a property titled <b>${title}</b>.</p>`,
      });
    } catch (err) {
      console.error('Email failed:', err.message);
    }

    return NextResponse.json({ message: 'Submitted successfully', property });
  } catch (err) {
    console.error('POST /properties/post failed:', err.message);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
