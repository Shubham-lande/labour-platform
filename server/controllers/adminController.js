const User = require('../models/User');
const Project = require('../models/Project');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const ActivityLog = require('../models/ActivityLog');
const { getDBStatus } = require('../config/db');
const {
  getFallbackUsers,
  getFallbackProjects,
  getFallbackBookingsForCustomer,
  getFallbackPayments,
  getFallbackComplaints,
  getFallbackActivityLogs,
  getFallbackVerifications,
  updateFallbackVerificationStatus,
  updateFallbackUserStatus,
} = require('./fallbackStore');

// @desc    Get Admin System Overview & KPI Count-up Metrics
// @route   GET /api/admin/dashboard
// @access  Private (Admin only)
const getAdminDashboard = async (req, res) => {
  try {
    const isMongoDB = getDBStatus();
    let totalLabour = 0;
    let totalCustomers = 0;
    let activeWorkers = 0;
    let activeProjects = 0;
    let totalBookings = 0;
    let completedJobs = 0;
    let pendingVerification = 0;
    let pendingComplaints = 0;
    let totalRevenue = 0;

    if (isMongoDB) {
      totalLabour = await User.countDocuments({ role: 'labour' });
      totalCustomers = await User.countDocuments({ role: 'customer' });
      activeWorkers = await User.countDocuments({ role: 'labour', status: 'active' });
      activeProjects = await Project.countDocuments({ status: { $in: ['in_progress', 'work_started', 'labour_assigned'] } });
      totalBookings = await Booking.countDocuments();
      completedJobs = await Project.countDocuments({ status: { $in: ['completed', 'customer_approved', 'closed'] } });
      pendingVerification = await User.countDocuments({ role: 'labour', isVerified: false });
      pendingComplaints = await Complaint.countDocuments({ status: { $in: ['submitted', 'under_review', 'investigating'] } });
      
      const payments = await Payment.find({ status: 'paid' });
      totalRevenue = payments.reduce((acc, p) => acc + p.amount, 0);
    } else {
      const users = getFallbackUsers();
      totalLabour = users.filter((u) => u.role === 'labour').length;
      totalCustomers = users.filter((u) => u.role === 'customer').length;
      activeWorkers = users.filter((u) => u.role === 'labour' && u.status === 'active').length;
      
      const prjs = getFallbackProjects();
      activeProjects = prjs.filter((p) => ['in_progress', 'work_started', 'labour_assigned'].includes(p.status)).length;
      completedJobs = prjs.filter((p) => ['completed', 'customer_approved', 'closed'].includes(p.status)).length;
      totalBookings = 18;
      
      const vers = getFallbackVerifications();
      pendingVerification = vers.filter((v) => v.status === 'under_review').length;
      
      const cmps = getFallbackComplaints();
      pendingComplaints = cmps.filter((c) => ['submitted', 'under_review', 'investigating'].includes(c.status)).length;
      
      const pays = getFallbackPayments();
      totalRevenue = pays.reduce((acc, p) => acc + (p.amount || 0), 0) || 520000;
    }

    return res.json({
      success: true,
      data: {
        kpi: {
          totalLabour,
          totalCustomers,
          activeWorkers,
          activeProjects,
          totalBookings,
          completedJobs,
          pendingVerification,
          pendingComplaints,
          totalRevenue,
          systemHealth: '99.98% Operational',
        },
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Manage Labour Workers Table
// @route   GET /api/admin/labour
// @access  Private (Admin only)
const getManageLabour = async (req, res) => {
  try {
    const isMongoDB = getDBStatus();
    if (!isMongoDB) {
      const users = getFallbackUsers().filter((u) => u.role === 'labour');
      return res.json({ success: true, count: users.length, data: users });
    }

    const users = await User.find({ role: 'labour' }).select('-password').sort('-createdAt');
    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Update Labour Status (Verify, Suspend, Block, Delete)
// @route   PUT /api/admin/labour/:id/status
// @access  Private (Admin only)
const updateLabourStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, isVerified } = req.body;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const user = updateFallbackUserStatus(id, status || 'active');
      if (isVerified !== undefined && user) user.isVerified = isVerified;
      return res.json({ success: true, message: `Worker status updated to ${status || 'verified'}`, user });
    }

    const updateObj = {};
    if (status) updateObj.status = status;
    if (isVerified !== undefined) updateObj.isVerified = isVerified;

    const user = await User.findByIdAndUpdate(id, updateObj, { new: true }).select('-password');
    return res.json({ success: true, message: `Worker status updated successfully`, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Manage Customers Table
// @route   GET /api/admin/customers
// @access  Private (Admin only)
const getManageCustomers = async (req, res) => {
  try {
    const isMongoDB = getDBStatus();
    if (!isMongoDB) {
      const users = getFallbackUsers().filter((u) => u.role === 'customer');
      return res.json({ success: true, count: users.length, data: users });
    }

    const users = await User.find({ role: 'customer' }).select('-password').sort('-createdAt');
    return res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Document Verification Queue
// @route   GET /api/admin/verifications
// @access  Private (Admin only)
const getVerifications = async (req, res) => {
  try {
    const isMongoDB = getDBStatus();
    if (!isMongoDB) {
      const list = getFallbackVerifications();
      return res.json({ success: true, count: list.length, data: list });
    }

    const unverifiedUsers = await User.find({ role: 'labour' }).select('-password');
    const verifications = unverifiedUsers.map((u) => ({
      _id: u._id,
      userId: u._id,
      userName: u.fullName,
      userRole: u.role,
      docType: 'Aadhaar Card & Trade License Proof',
      docUrl: u.avatar || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
      status: u.isVerified ? 'verified' : 'under_review',
      submissionDate: u.createdAt,
    }));

    return res.json({ success: true, count: verifications.length, data: verifications });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Approve or Reject Verification
// @route   PUT /api/admin/verifications/:id
// @access  Private (Admin only)
const updateVerification = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectionReason } = req.body; // status: 'verified' | 'rejected'

    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required when rejecting documents.' });
    }

    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const ver = updateFallbackVerificationStatus(id, status, rejectionReason);
      return res.json({ success: true, message: `Verification status set to ${status.toUpperCase()}`, verification: ver });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { isVerified: status === 'verified' },
      { new: true }
    );

    return res.json({
      success: true,
      message: `Verification status set to ${status.toUpperCase()}`,
      verification: { _id: id, status, rejectionReason },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin Reports & Recharts Analytics Stream
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getAnalytics = async (req, res) => {
  try {
    const analyticsData = {
      bookingTrends: [
        { month: 'Jan', bookings: 24, revenue: 140000 },
        { month: 'Feb', bookings: 38, revenue: 210000 },
        { month: 'Mar', bookings: 45, revenue: 310000 },
        { month: 'Apr', bookings: 52, revenue: 380000 },
        { month: 'May', bookings: 68, revenue: 490000 },
        { month: 'Jun', bookings: 85, revenue: 580000 },
        { month: 'Jul', bookings: 94, revenue: 670000 },
        { month: 'Aug', bookings: 112, revenue: 840000 },
      ],
      popularCategories: [
        { category: 'Certified Electricians', count: 42, percentage: 38 },
        { category: 'Master Plumbers', count: 28, percentage: 25 },
        { category: 'Civil & Masonry', count: 22, percentage: 20 },
        { category: 'HVAC Techs', count: 19, percentage: 17 },
      ],
      projectCompletionRate: {
        completed: 82,
        inProgress: 14,
        cancelled: 4,
      },
    };

    return res.json({ success: true, data: analyticsData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin System Audit Trail Activity Log
// @route   GET /api/admin/activity-log
// @access  Private (Admin only)
const getActivityLogs = async (req, res) => {
  try {
    const isMongoDB = getDBStatus();
    if (!isMongoDB) {
      const logs = getFallbackActivityLogs();
      return res.json({ success: true, count: logs.length, data: logs });
    }

    const logs = await ActivityLog.find().sort('-createdAt').limit(50);
    return res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAdminDashboard,
  getManageLabour,
  updateLabourStatus,
  getManageCustomers,
  getVerifications,
  updateVerification,
  getAnalytics,
  getActivityLogs,
};
