import mongoose from 'mongoose'

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiry: { type: Date, required: true },
}, { timestamps: true })

export const Otp = mongoose.models.Otp || mongoose.model('Otp', otpSchema)
