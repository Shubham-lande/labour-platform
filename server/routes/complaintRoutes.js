const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { raiseComplaint, getComplaints, updateComplaintStatus } = require('../controllers/complaintController');

router.post('/', protect, raiseComplaint);
router.get('/', protect, getComplaints);
router.put('/:id/status', protect, updateComplaintStatus);

module.exports = router;
