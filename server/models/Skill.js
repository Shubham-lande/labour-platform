const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    demandLevel: { type: String, enum: ['High', 'Medium', 'Standard'], default: 'High' },
    averageDailyRate: { type: Number, default: 1000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Skill', skillSchema);
