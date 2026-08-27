const mongoose = require('mongoose');

const workUpdateSchema = new mongoose.Schema(
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
    workerName: {
      type: String,
      default: 'Skilled Labour',
    },
    description: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      default: '',
    },
    progressPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('WorkUpdate', workUpdateSchema);
