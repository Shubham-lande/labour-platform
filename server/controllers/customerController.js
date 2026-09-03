const Project = require('../models/Project');
const Booking = require('../models/Booking');
const { getDBStatus } = require('../config/db');
const { getFallbackProjects, getFallbackBookingsForCustomer } = require('./fallbackStore');

// @desc    Get Customer Dashboard Data
// @route   GET /api/customer/dashboard
// @access  Private (Customer only)
const getCustomerDashboard = async (req, res) => {
  try {
    const customerId = req.user._id || req.user.id;
    const isMongoDB = getDBStatus();

    let myProjects = [];
    let myBookings = [];

    if (isMongoDB) {
      const rawProjects = await Project.find({ customer: customerId }).sort('-createdAt');
      myProjects = rawProjects.map((p) => ({
        id: p._id,
        name: p.name,
        site: p.location?.address || p.location?.city || 'Site',
        status: p.status,
        progress: p.progressPercentage || 0,
        activeWorkers: p.assignedWorkers?.length || p.workerCount || 1,
      }));

      const rawBookings = await Booking.find({ customer: customerId }).sort('-createdAt');
      myBookings = rawBookings.map((b) => ({
        id: b._id,
        title: b.title,
        workers: b.workerCount || 1,
        location: b.location?.address || b.location?.city || 'Location',
        startDate: b.startDate ? new Date(b.startDate).toLocaleDateString() : 'Immediate',
        status: b.status,
        budget: `₹${b.estimatedBudget}`,
      }));
    } else {
      const rawProjects = getFallbackProjects('all').filter(
        (p) => p.customer.toString() === customerId.toString()
      );
      myProjects = rawProjects.map((p) => ({
        id: p._id,
        name: p.name,
        site: p.location?.address || p.location?.city || 'Site',
        status: p.status,
        progress: p.progressPercentage || 0,
        activeWorkers: p.assignedWorkers?.length || p.workerCount || 1,
      }));

      const rawBookings = getFallbackBookingsForCustomer(customerId);
      myBookings = rawBookings.map((b) => ({
        id: b._id,
        title: b.title,
        workers: b.workerCount || 1,
        location: b.location?.address || b.location?.city || 'Location',
        startDate: b.startDate ? b.startDate : 'Immediate',
        status: b.status,
        budget: `₹${b.estimatedBudget}`,
      }));
    }

    const mockDashboardData = {
      stats: {
        activeBookings: myBookings.filter((b) => b.status === 'pending' || b.status === 'accepted').length,
        activeProjects: myProjects.filter((p) => p.status === 'in_progress' || p.status === 'labour_assigned').length,
        totalAssignedWorkers: myProjects.reduce((acc, p) => acc + (p.activeWorkers || 0), 0) || 15,
        monthlySpent: 425000,
        pendingApprovals: 2,
        satisfactionRating: 4.95,
      },
      availableLabourCategories: [
        { category: 'Certified Electricians', count: 48, rate: '₹120-180/hr', icon: 'Zap' },
        { category: 'Master Plumbers & Pipefitters', count: 34, rate: '₹110-160/hr', icon: 'Droplets' },
        { category: 'Civil & Masonry Specialists', count: 82, rate: '₹90-140/hr', icon: 'Hammer' },
        { category: 'HVAC & Ducting Techs', count: 26, rate: '₹130-190/hr', icon: 'Wind' },
      ],
      myBookings: myBookings.length > 0 ? myBookings : [
        { id: 'BK-7701', title: 'Commercial Tower Phase 2 Electrical Crew', workers: 8, location: 'Lower Parel', startDate: '2026-08-18', status: 'active', budget: '₹140,000' },
      ],
      myProjects: myProjects.length > 0 ? myProjects : [
        { id: 'PRJ-101', name: 'Horizon High-Rise Tower A', site: 'Lower Parel', status: 'In Progress', progress: 68, activeWorkers: 14 },
      ],
      recentPayments: [
        { id: 'PAY-3310', date: '2026-08-21', project: 'Horizon Tower A', amount: 140000, recipient: 'Labour Booking Escrow', status: 'escrow_locked' },
        { id: 'PAY-3298', date: '2026-08-15', project: 'Warehouse Masonry', amount: 190000, recipient: '11 Verified Workers', status: 'settled' },
      ],
    };

    return res.json({
      success: true,
      data: mockDashboardData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getCustomerDashboard };
