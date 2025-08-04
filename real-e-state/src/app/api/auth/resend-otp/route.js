import connectDB from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  await connectDB();
  const { phone } = await req.json();

  const user = await User.findOne({ phone });
  if (!user) {
    return Response.json({ error: 'User not found' }, { status: 404 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOTP = await bcrypt.hash(otp, 10);

  const smsRes = await fetch("https://www.fast2sms.com/dev/bulkV2", {
    method: "POST",
    headers: {
      authorization: process.env.FAST2SMS_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      variables_values: otp,
      route: "otp",
      numbers: phone
    })
  });

  if (!smsRes.ok) {
    return Response.json({ error: 'Failed to resend OTP' }, { status: 500 });
  }

  user.otp = hashedOTP;
  user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // new 5 mins
  await user.save();

  return Response.json({ success: true, message: "OTP resent successfully" });
}
