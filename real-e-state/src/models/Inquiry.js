import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
