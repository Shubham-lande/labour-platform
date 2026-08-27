const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema(
  {
    labourId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: { type: String, enum: ['available', 'busy', 'offline'], default: 'available' },
    workingHours: { type: String, default: '08:00 AM - 06:00 PM (Mon-Sat)' },
    preferredLocations: [{ type: String }],
    unavailabilityDates: [{ type: Date }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Availability', availabilitySchema);
