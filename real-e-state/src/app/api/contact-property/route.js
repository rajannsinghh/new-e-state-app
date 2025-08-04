import { connectDB } from '@/lib/db';
import { Message } from '@/models/Message';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    await connectDB();

    const { propertyId, fromUser, toUser, message } = await req.json();

    // Basic validation
    if (!propertyId || !fromUser || !toUser || !message?.trim()) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save to DB
    const newMessage = await Message.create({
      propertyId,
      fromUser,
      toUser,
      message: message.trim(),
    });

    // Email setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send notification email to property owner
    await transporter.sendMail({
      from: `"E-State Contact" <${process.env.MAIL_USER}>`,
      to: toUser,
      subject: 'New Inquiry on Your Property',
      html: `
        <p>You received a new message regarding your property listing.</p>
        <p><strong>From:</strong> ${fromUser}</p>
        <p><strong>Message:</strong></p>
        <blockquote style="background:#f9f9f9;padding:10px;border-left:4px solid #ccc;">${message}</blockquote>
        <p>Please log in to your dashboard to respond.</p>
      `,
    });

    return NextResponse.json({ success: true, message: 'Message sent successfully' });
  } catch (err) {
    console.error('Contact form error:', err);
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 });
  }
}
