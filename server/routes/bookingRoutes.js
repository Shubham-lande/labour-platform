const express = require('express');
const router = express.Router();
const {
  createBooking,
  getCustomerBookings,
  getLabourBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('customer', 'admin'), createBooking);
router.get('/customer', protect, authorize('customer', 'admin'), getCustomerBookings);
router.get('/labour', protect, authorize('labour', 'admin'), getLabourBookings);
router.put('/:id/status', protect, updateBookingStatus);

module.exports = router;
