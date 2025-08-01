import { connectDB } from '@/lib/db';
import { Inquiry } from '@/models/Inquiry';
import { sendInquiryEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    const body = await req.json();
    await connectDB();

    const newInquiry = new Inquiry(body);
    await newInquiry.save();

    await sendInquiryEmail(body);

    return Response.json({ success: true, message: "Inquiry saved!" });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false, message: "Failed to save inquiry." }, { status: 500 });
  }
}
