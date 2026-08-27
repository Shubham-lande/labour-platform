const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAdminDashboard,
  getManageLabour,
  updateLabourStatus,
  getManageCustomers,
  getVerifications,
  updateVerification,
  getAnalytics,
  getActivityLogs,
} = require('../controllers/adminController');

// All endpoints in this router enforce strict Admin authorization
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getAdminDashboard);
router.get('/labour', getManageLabour);
router.put('/labour/:id/status', updateLabourStatus);
router.get('/customers', getManageCustomers);
router.get('/verifications', getVerifications);
router.put('/verifications/:id', updateVerification);
router.get('/analytics', getAnalytics);
router.get('/activity-log', getActivityLogs);

module.exports = router;
