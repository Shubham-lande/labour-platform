const mongoose = require('mongoose');

const passwordResetSchema = new mongoose.Schema(
  {
    identifier: {
      type: String, // email or mobile number
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('PasswordReset', passwordResetSchema);
