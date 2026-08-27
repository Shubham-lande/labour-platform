const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: 'Mumbai' },
      state: { type: String, default: 'Maharashtra' },
      pincode: { type: String, default: '400001' },
    },
    requiredSkills: [
      {
        type: String,
        trim: true,
      },
    ],
    workerCount: {
      type: Number,
      default: 1,
    },
    startDate: {
      type: Date,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: [
        'created',
        'labour_assigned',
        'scheduled',
        'work_started',
        'in_progress',
        'paused',
        'completed',
        'customer_approved',
        'closed',
        'cancelled',
      ],
      default: 'created',
    },
    progressPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    assignedWorkers: [
      {
        workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        workerName: { type: String },
        assignmentStatus: {
          type: String,
          enum: ['assigned', 'accepted', 'rejected', 'working', 'completed'],
          default: 'assigned',
        },
        assignedAt: { type: Date, default: Date.now },
      },
    ],
    activityHistory: [
      {
        action: { type: String, required: true },
        performedBy: { type: String, default: 'System' },
        timestamp: { type: Date, default: Date.now },
        details: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Project', projectSchema);
