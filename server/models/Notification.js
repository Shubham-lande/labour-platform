const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'booking_request',
        'booking_accepted',
        'booking_rejected',
        'worker_assigned',
        'work_started',
        'work_paused',
        'work_completed',
        'payment_received',
        'payment_sent',
        'review_submitted',
        'complaint_raised',
        'deadline_warning',
      ],
      default: 'booking_request',
    },
    link: { type: String, default: '' },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
