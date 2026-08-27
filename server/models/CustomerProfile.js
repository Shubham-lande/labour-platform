const mongoose = require('mongoose');

const customerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    companyName: {
      type: String,
      default: 'Individual Client / Contractor',
    },
    industry: {
      type: String,
      default: 'Construction & Civil Engineering',
    },
    address: {
      city: { type: String, default: 'Mumbai' },
      state: { type: String, default: 'Maharashtra' },
      pincode: { type: String, default: '400001' },
    },
    totalBookings: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    verifiedStatus: {
      type: String,
      enum: ['verified', 'pending', 'unverified'],
      default: 'verified',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('CustomerProfile', customerProfileSchema);
