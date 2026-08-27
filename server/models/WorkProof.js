const mongoose = require('mongoose');

const workProofSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    proofType: {
      type: String,
      enum: ['photo', 'document', 'certificate', 'inspection_report'],
      default: 'photo',
    },
    proofUrl: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    verifiedStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WorkProof', workProofSchema);
