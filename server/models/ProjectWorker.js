const mongoose = require('mongoose');

const projectWorkerSchema = new mongoose.Schema(
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
    assignmentStatus: {
      type: String,
      enum: ['assigned', 'accepted', 'rejected', 'working', 'completed'],
      default: 'assigned',
    },
    roleTitle: {
      type: String,
      default: 'Site Technician',
    },
    dailyRate: {
      type: Number,
      default: 1000,
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ProjectWorker', projectWorkerSchema);
