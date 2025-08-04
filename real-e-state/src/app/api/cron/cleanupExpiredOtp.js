import { connectDB } from "@/lib/db";
import { User } from "@/models/User";

export async function GET() {
  await connectDB();

  const result = await User.updateMany(
    { otpExpiry: { $lt: new Date() } },
    { $unset: { otp: "", otpExpiry: "" } }
  );

  return Response.json({ message: "Expired OTPs cleaned", result });
}
