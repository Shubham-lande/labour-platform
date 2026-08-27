const Review = require('../models/Review');
const LabourProfile = require('../models/LabourProfile');
const { getDBStatus } = require('../config/db');
const { addFallbackReview, getFallbackReviewsForLabour } = require('./fallbackStore');

// @desc    Submit Review & Rating for Labour Worker
// @route   POST /api/reviews
// @access  Private (Customer)
const createReview = async (req, res) => {
  try {
    const customerId = req.user._id || req.user.id;
    const {
      projectId,
      bookingId,
      labourId,
      labourName,
      rating,
      qualityRating,
      behaviourRating,
      punctualityRating,
      skillRating,
      comment,
    } = req.body;

    if (!labourId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Labour worker ID, rating, and written feedback are required.' });
    }

    const numRating = parseFloat(rating);
    if (numRating < 1 || numRating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
    }

    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      try {
        const review = addFallbackReview({
          project: projectId,
          booking: bookingId,
          customer: customerId,
          labour: labourId,
          customerName: req.user.fullName || 'Apex Buildcon Ltd',
          labourName: labourName || 'Skilled Labour',
          rating: numRating,
          qualityRating: qualityRating || 5,
          behaviourRating: behaviourRating || 5,
          punctualityRating: punctualityRating || 5,
          skillRating: skillRating || 5,
          comment,
        });

        return res.status(201).json({
          success: true,
          message: 'Review and rating submitted successfully!',
          review,
        });
      } catch (err) {
        return res.status(400).json({ success: false, message: err.message });
      }
    }

    // Backend duplicate review check
    let existingQuery = { customer: customerId, labour: labourId };
    if (projectId) existingQuery.project = projectId;
    if (bookingId) existingQuery.booking = bookingId;

    const existingReview = await Review.findOne(existingQuery);
    if (existingReview) {
      return res.status(400).json({ success: false, message: 'A review has already been submitted for this completed job.' });
    }

    const review = await Review.create({
      project: projectId,
      booking: bookingId,
      customer: customerId,
      labour: labourId,
      customerName: req.user.fullName || 'Client Contractor',
      labourName: labourName || 'Skilled Labour',
      rating: numRating,
      qualityRating: qualityRating || 5,
      behaviourRating: behaviourRating || 5,
      punctualityRating: punctualityRating || 5,
      skillRating: skillRating || 5,
      comment,
    });

    // Recalculate Labour Profile Rating & Reviews Count
    const profile = await LabourProfile.findOne({ userId: labourId });
    if (profile) {
      const allReviews = await Review.find({ labour: labourId });
      const totalRating = allReviews.reduce((acc, r) => acc + r.rating, 0);
      profile.rating = Math.round((totalRating / allReviews.length) * 10) / 10;
      profile.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Review and rating submitted successfully!',
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'A review has already been submitted for this completed job.' });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Reviews for Labour Worker
// @route   GET /api/reviews/labour/:id
// @access  Public / Private
const getLabourReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const reviews = getFallbackReviewsForLabour(id);
      return res.json({ success: true, count: reviews.length, data: reviews });
    }

    const reviews = await Review.find({ labour: id })
      .populate('customer', 'fullName avatar')
      .sort('-createdAt');

    return res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createReview,
  getLabourReviews,
};
