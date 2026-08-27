const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    raisedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userInvolved: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    raisedByName: { type: String, default: 'User' },
    userInvolvedName: { type: String, default: 'Workforce User' },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    complaintType: {
      type: String,
      enum: [
        'work_quality_issue',
        'attendance_absence',
        'delayed_payout',
        'safety_violation',
        'contract_dispute',
        'other',
      ],
      default: 'work_quality_issue',
    },
    description: {
      type: String,
      required: [true, 'Complaint description is required'],
    },
    evidenceUrl: {
      type: String,
      default: '',
    },
    amountInvolved: {
      type: Number,
      default: 0,
      min: [0, 'Amount involved must be non-negative'],
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'investigating', 'resolved', 'rejected', 'closed'],
      default: 'submitted',
    },
    resolutionNotes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
