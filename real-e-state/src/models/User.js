import mongoose from 'mongoose';
import { unique } from 'next/dist/build/utils';
import { date } from 'zod';

const UserSchema = new mongoose.Schema({
  name: {type: String, trim: true},
  email: { type: String, unique: true, required: true, lowercase: true, trim: true},
  password: { type: String, required: true },
  phone: {type: String, unique: true},
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiry: date,
  role: { type: String, enum: ['user', 'owner', 'admin'], default: 'user' },
  avatar: {type: String, default: ''},
  createdAt: { type: Date, default: Date.now},
  isBlocked: { type: Boolean, default: false},
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
