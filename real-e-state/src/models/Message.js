import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true,
  },
  fromUser: String, // or ObjectId if you want to reference User
  toUser: String,   // the owner's email
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
