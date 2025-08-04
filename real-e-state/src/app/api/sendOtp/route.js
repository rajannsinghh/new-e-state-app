import connectDB from '@/lib/db';
import OtpStore from '@/models/Otp';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await connectDB();

  const { name, email, phone, password } = await req.json();

  const existing = await OtpStore.findOne({ phone });
  if (existing && existing.expiresAt > new Date()) {
    return Response.json({ error: "OTP already sent. Please wait." }, { status: 429 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpHash = await bcrypt.hash(otp, 10);

  // Replace this block with your 2Factor API or similar service
  const smsRes = await fetch(`https://2factor.in/API/V1/${process.env.TWO_FACTOR_API_KEY}/SMS/${phone}/${otp}`, {
    method: "GET"
  });

  if (!smsRes.ok) {
    return Response.json({ error: 'Failed to send OTP' }, { status: 500 });
  }

  await OtpStore.findOneAndUpdate(
    { phone },
    {
      phone,
      otpHash,
      data: {
        name,
        email,
        password: await bcrypt.hash(password, 10)
      },
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    },
    { upsert: true }
  );

  return Response.json({ success: true, message: "OTP sent successfully" });
}
