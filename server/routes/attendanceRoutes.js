const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { recordAttendance, getAttendanceHistory } = require('../controllers/attendanceController');

router.get('/', protect, getAttendanceHistory);
router.post('/', protect, recordAttendance);

module.exports = router;
