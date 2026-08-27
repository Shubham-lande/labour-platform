const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    project: {
      type: String, // Project or Conversation Thread ID
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: { type: String, default: 'User' },
    senderRole: { type: String, enum: ['customer', 'labour', 'admin'], default: 'customer' },
    text: { type: String, default: '' },
    photoUrl: { type: String, default: '' },
    documentUrl: { type: String, default: '' },
    documentName: { type: String, default: '' },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Message', messageSchema);
