import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { Otp } from '@/models/Otp'
import { sendEmail } from '@/lib/mailer'
import { NextResponse } from 'next/server'

export async function POST(req) {
  await connectDB()
  const { email } = await req.json()

  const user = await User.findOne({ email })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const otp = Math.floor(100000 + Math.random() * 900000)
  const expiry = Date.now() + 15 * 60 * 1000 // 15 mins

  await Otp.create({ email, otp, expiry })

  await sendEmail({
    to: email,
    subject: 'Reset your password',
    text: `Your OTP to reset password is ${otp}. It is valid for 15 minutes.`,
  })

  return NextResponse.json({ message: 'OTP sent to your email' })
}
