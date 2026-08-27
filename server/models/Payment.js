const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
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
    customerName: { type: String, default: 'Customer Enterprise' },
    labourName: { type: String, default: 'Skilled Labour' },
    amount: {
      type: Number,
      required: true,
      min: [0, 'Amount must be non-negative'],
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: [0, 'Paid amount must be non-negative'],
    },
    remainingAmount: {
      type: Number,
      default: 0,
      min: [0, 'Remaining amount must be non-negative'],
    },
    paymentMethod: {
      type: String,
      enum: ['upi_razorpay', 'card_stripe', 'bank_transfer', 'escrow_wallet'],
      default: 'upi_razorpay',
    },
    status: {
      type: String,
      enum: ['pending', 'partially_paid', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    breakdown: {
      rate: { type: Number, default: 0 },
      duration: { type: String, default: '1 Day' },
      additionalCharges: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Payment', paymentSchema);
