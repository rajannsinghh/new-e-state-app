import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: Number,
    location: String,
    images: [String],
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);
