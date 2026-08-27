const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    labour: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: { type: String, default: 'Client Contractor' },
    labourName: { type: String, default: 'Skilled Labour' },
    rating: {
      type: Number,
      required: true,
      min: [1, 'Rating minimum is 1 star'],
      max: [5, 'Rating maximum is 5 stars'],
    },
    qualityRating: { type: Number, default: 5, min: 1, max: 5 },
    behaviourRating: { type: Number, default: 5, min: 1, max: 5 },
    punctualityRating: { type: Number, default: 5, min: 1, max: 5 },
    skillRating: { type: Number, default: 5, min: 1, max: 5 },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate reviews for the same project or booking by the same customer
reviewSchema.index({ project: 1, customer: 1, labour: 1 }, { unique: true, sparse: true });
reviewSchema.index({ booking: 1, customer: 1, labour: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Review', reviewSchema);
