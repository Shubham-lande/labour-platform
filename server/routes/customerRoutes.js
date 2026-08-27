const express = require('express');
const router = express.Router();
const { getCustomerDashboard } = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, authorize('customer', 'admin'), getCustomerDashboard);

module.exports = router;
