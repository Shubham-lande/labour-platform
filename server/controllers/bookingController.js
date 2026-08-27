const Booking = require('../models/Booking');
const User = require('../models/User');
const LabourProfile = require('../models/LabourProfile');
const { getDBStatus } = require('../config/db');
const {
  addFallbackBooking,
  getFallbackBookingsForCustomer,
  getFallbackBookingsForLabour,
  updateFallbackBookingStatus,
} = require('./fallbackStore');

// @desc    Create a new workforce booking request
// @route   POST /api/bookings
// @access  Private (Customer only)
const createBooking = async (req, res) => {
  try {
    const customerId = req.user._id || req.user.id;
    const {
      labourId,
      title,
      category,
      description,
      location,
      startDate,
      endDate,
      startTime,
      workerCount,
      estimatedBudget,
      specialInstructions,
    } = req.body;

    if (!labourId || !title || !category || !startDate || !endDate || !estimatedBudget) {
      return res.status(400).json({ success: false, message: 'Please provide all required booking fields.' });
    }

    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const labourUser = req.body.labourName || 'Skilled Labour Worker';
      const newBooking = addFallbackBooking({
        customer: customerId,
        labour: labourId,
        customerName: req.user.fullName || 'Apex Buildcon Ltd',
        labourName: labourUser,
        title,
        category,
        description,
        location: location || { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        startDate,
        endDate,
        startTime: startTime || '09:00 AM',
        workerCount: workerCount || 1,
        estimatedBudget,
        specialInstructions,
      });

      return res.status(201).json({
        success: true,
        message: 'Work booking request submitted successfully!',
        booking: newBooking,
      });
    }

    const booking = await Booking.create({
      customer: customerId,
      labour: labourId,
      title,
      category,
      description,
      location,
      startDate,
      endDate,
      startTime,
      workerCount: workerCount || 1,
      estimatedBudget,
      specialInstructions,
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      message: 'Work booking request submitted successfully!',
      booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Customer Bookings
// @route   GET /api/bookings/customer
// @access  Private (Customer)
const getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.user._id || req.user.id;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const bookings = getFallbackBookingsForCustomer(customerId);
      return res.json({ success: true, count: bookings.length, data: bookings });
    }

    const bookings = await Booking.find({ customer: customerId })
      .populate('labour', 'fullName email mobileNumber avatar isVerified')
      .sort('-createdAt');

    return res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Labour Work Requests
// @route   GET /api/bookings/labour
// @access  Private (Labour)
const getLabourBookings = async (req, res) => {
  try {
    const labourId = req.user._id || req.user.id;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const bookings = getFallbackBookingsForLabour(labourId);
      return res.json({ success: true, count: bookings.length, data: bookings });
    }

    const bookings = await Booking.find({ labour: labourId })
      .populate('customer', 'fullName email mobileNumber avatar isVerified')
      .sort('-createdAt');

    return res.json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Booking Status (Accept / Reject / Cancel / Complete)
// @route   PUT /api/bookings/:id/status
// @access  Private (Customer or Labour)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted', 'rejected', 'cancelled', 'completed'

    if (!['accepted', 'rejected', 'cancelled', 'scheduled', 'completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid booking status' });
    }

    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const updated = updateFallbackBookingStatus(id, status);
      if (!updated) {
        return res.status(404).json({ success: false, message: 'Booking record not found' });
      }
      return res.json({
        success: true,
        message: `Booking request status updated to ${status}!`,
        data: updated,
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking record not found' });
    }

    booking.status = status;
    await booking.save();

    return res.json({
      success: true,
      message: `Booking request status updated to ${status}!`,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getCustomerBookings,
  getLabourBookings,
  updateBookingStatus,
};
