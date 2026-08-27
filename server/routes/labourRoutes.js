const express = require('express');
const router = express.Router();
const {
  getLabourDashboard,
  getLabourProfiles,
  getSmartRecommendations,
  getLabourProfileById,
  updateMyProfile,
} = require('../controllers/labourController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Dashboard metrics
router.get('/dashboard', protect, authorize('labour', 'admin'), getLabourDashboard);

// Public / Private Search & Profile Endpoints
router.get('/profiles', getLabourProfiles);
router.get('/recommendations', getSmartRecommendations);
router.get('/profiles/:id', getLabourProfileById);
router.put('/profile/me', protect, authorize('labour'), updateMyProfile);

module.exports = router;
