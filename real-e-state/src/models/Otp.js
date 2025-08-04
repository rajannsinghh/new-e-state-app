import mongoose from 'mongoose';

const otpStoreSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  otpHash: String,
  data: Object,
  expiresAt: Date,
}, { timestamps: true });

export default mongoose.models.OtpStore || mongoose.model("OtpStore", otpStoreSchema);
