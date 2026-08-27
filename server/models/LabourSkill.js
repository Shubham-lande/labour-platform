const mongoose = require('mongoose');

const labourSkillSchema = new mongoose.Schema(
  {
    labourId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    skillId: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    skillName: { type: String, required: true },
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Expert', 'Master'], default: 'Expert' },
    yearsOfExperience: { type: Number, default: 1 },
    isCertified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('LabourSkill', labourSkillSchema);
