const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema(
  {
    event: { type: String, required: true },
    category: {
      type: String,
      enum: ['booking', 'assignment', 'work_status', 'payment', 'review', 'complaint', 'verification', 'user'],
      default: 'booking',
    },
    performedBy: { type: String, default: 'System / User' },
    actorRole: { type: String, default: 'user' },
    targetRecordId: { type: String, default: '' },
    details: { type: String, default: '' },
    severity: { type: String, enum: ['info', 'success', 'warning', 'danger'], default: 'info' },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ActivityLog', activityLogSchema);
