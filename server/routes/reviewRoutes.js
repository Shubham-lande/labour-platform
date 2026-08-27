const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createReview, getLabourReviews } = require('../controllers/reviewController');

router.post('/', protect, createReview);
router.get('/labour/:id', getLabourReviews);

module.exports = router;
