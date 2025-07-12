import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  otp: String,
  role: { type: String, enum: ['user', 'owner'], default: 'user' },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
