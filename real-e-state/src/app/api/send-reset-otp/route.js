import { connectDB } from '@/lib/db'
import { Otp } from '@/models/Otp'
import { User } from '@/models/User'
import { sendEmail } from '@/lib/mailer'
import { generateOTP } from '@/lib/generateOtp'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const { email } = await req.json()
    await connectDB()

    // Check if user exists
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Generate OTP
    const otp = generateOTP()
    const expiry = new Date(Date.now() + 5 * 60 * 1000) // 5 mins

    // Save to DB (overwrite if exists)
    await Otp.findOneAndUpdate(
      { email },
      { email, otp, expiry },
      { upsert: true, new: true }
    )

    // Send Email
    await sendEmail({
      to: email,
      subject: 'Your Password Reset OTP',
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p><p>Expires in 5 minutes.</p>`,
    })

    return NextResponse.json({ message: 'OTP sent successfully' })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
