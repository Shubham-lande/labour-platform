const Skill = require('../models/Skill');
const { getDBStatus } = require('../config/db');

const defaultSkills = [
  { name: 'Electrical Wiring', category: 'Certified Electricians', demandLevel: 'High', averageDailyRate: 1200 },
  { name: 'High Voltage Switchgear', category: 'Certified Electricians', demandLevel: 'High', averageDailyRate: 1500 },
  { name: 'Commercial Pipefitting', category: 'Master Plumbers & Pipefitters', demandLevel: 'High', averageDailyRate: 1100 },
  { name: 'Hydraulic Pressure Testing', category: 'Master Plumbers & Pipefitters', demandLevel: 'High', averageDailyRate: 1300 },
  { name: 'Formwork Shuttering', category: 'Master Carpenters', demandLevel: 'Medium', averageDailyRate: 1050 },
  { name: 'Brickwork Partitioning', category: 'Civil & Masonry Specialists', demandLevel: 'Standard', averageDailyRate: 950 },
  { name: 'Chiller Unit Overhaul', category: 'HVAC & Ducting Techs', demandLevel: 'High', averageDailyRate: 1400 },
];

const getSkills = async (req, res) => {
  try {
    const isMongoDB = getDBStatus();
    if (!isMongoDB) {
      return res.json({ success: true, count: defaultSkills.length, data: defaultSkills });
    }

    let skills = await Skill.find().sort('name');
    if (skills.length === 0) {
      skills = await Skill.insertMany(defaultSkills);
    }

    return res.json({ success: true, count: skills.length, data: skills });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getSkills };
