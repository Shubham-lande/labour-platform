const mongoose = require('mongoose');

const labourProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    workCategories: [
      {
        type: String,
        trim: true,
      },
    ],
    experienceYears: {
      type: Number,
      default: 1,
    },
    dailyRate: {
      type: Number,
      default: 800,
    },
    hourlyRate: {
      type: Number,
      default: 120,
    },
    location: {
      city: { type: String, default: 'Mumbai' },
      state: { type: String, default: 'Maharashtra' },
      pincode: { type: String, default: '400001' },
    },
    serviceArea: {
      type: String,
      default: 'Mumbai Metropolitan Region & Navi Mumbai',
    },
    workingHours: {
      type: String,
      default: '08:00 AM - 06:00 PM (Mon-Sat)',
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'busy', 'offline'],
      default: 'available',
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    completedJobs: {
      type: Number,
      default: 0,
    },
    totalEarnings: {
      type: Number,
      default: 0,
    },
    verificationDocs: {
      idCardUploaded: { type: Boolean, default: false },
      skillsCertificate: { type: Boolean, default: false },
      policeVerification: { type: Boolean, default: false },
    },
    bio: {
      type: String,
      default: 'Experienced skilled professional ready for industrial, commercial, and residential projects.',
    },
    reviews: [
      {
        customerName: { type: String },
        rating: { type: Number },
        comment: { type: String },
        date: { type: String },
      },
    ],
    workHistory: [
      {
        jobTitle: { type: String },
        clientName: { type: String },
        duration: { type: String },
        amount: { type: String },
        rating: { type: Number },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('LabourProfile', labourProfileSchema);
