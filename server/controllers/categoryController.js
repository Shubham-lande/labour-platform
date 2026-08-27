const Category = require('../models/Category');
const { getDBStatus } = require('../config/db');

const defaultCategories = [
  { name: 'Certified Electricians', icon: 'Zap', description: 'High voltage switchgear, industrial wiring, solar substation.', activeWorkersCount: 42 },
  { name: 'Master Plumbers & Pipefitters', icon: 'Droplets', description: 'Chilled water lines, hydraulic pressure testing, commercial piping.', activeWorkersCount: 38 },
  { name: 'Civil & Masonry Specialists', icon: 'Building', description: 'Brickwork, concrete casting, plastering, shuttering foundation.', activeWorkersCount: 56 },
  { name: 'HVAC & Ducting Techs', icon: 'Wind', description: 'Air handling units, VRF system maintenance, duct fabrication.', activeWorkersCount: 29 },
  { name: 'Master Carpenters', icon: 'Hammer', description: 'Formwork shuttering, modular joinery, scaffolding decking.', activeWorkersCount: 34 },
];

const getCategories = async (req, res) => {
  try {
    const isMongoDB = getDBStatus();
    if (!isMongoDB) {
      return res.json({ success: true, count: defaultCategories.length, data: defaultCategories });
    }

    let categories = await Category.find().sort('name');
    if (categories.length === 0) {
      categories = await Category.insertMany(defaultCategories);
    }

    return res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCategories };
