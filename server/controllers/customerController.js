// @desc    Get Customer Dashboard Data
// @route   GET /api/customer/dashboard
// @access  Private (Customer only)
const getCustomerDashboard = async (req, res) => {
  try {
    const mockDashboardData = {
      stats: {
        activeBookings: 6,
        activeProjects: 3,
        totalAssignedWorkers: 24,
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
      myBookings: [
        { id: 'BK-7701', title: 'Commercial Tower Phase 2 Electrical Crew', workers: 8, location: 'Lower Parel', startDate: '2026-08-18', status: 'active', budget: '₹140,000' },
        { id: 'BK-7692', title: 'Data Center Plumbing & Cooling Setup', workers: 5, location: 'BKC Financial Center', startDate: '2026-08-20', status: 'active', budget: '₹95,000' },
        { id: 'BK-7611', title: 'Warehouse Masonry Work', workers: 11, location: 'Bhiwandi Logistics Hub', startDate: '2026-08-01', status: 'completed', budget: '₹190,000' },
      ],
      myProjects: [
        { id: 'PRJ-101', name: 'Horizon High-Rise Tower A', site: 'Lower Parel', status: 'In Progress', progress: 68, activeWorkers: 14 },
        { id: 'PRJ-102', name: 'Metro Line Substation Wiring', site: 'Andheri East', status: 'In Progress', progress: 42, activeWorkers: 10 },
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
