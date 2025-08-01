import { connectDB } from '@/lib/db';
import { Property } from '@/models/Property';
import { User } from '@/models/User';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  const token = cookies().get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();

    const { title, description, price, location, image } = await req.json();

    const property = await Property.create({
      title,
      description,
      price,
      location,
      postedBy: decoded.id,
      isApproved: false,
      images: image ? [image] : [],
    });

    // Notify owner by email
    const user = await User.findById(decoded.id);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `E-State <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      subject: 'New Property Submission (Approval Needed)',
      html: `
        <p>A new property has been submitted by ${user.name} (${user.email}).</p>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>Price:</strong> ₹${price}</p>
        <p>Please login to your dashboard to approve it.</p>
      `,
    });

    return NextResponse.json({ message: 'Property submitted. Awaiting approval.', property });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token or internal error' }, { status: 500 });
  }
}
