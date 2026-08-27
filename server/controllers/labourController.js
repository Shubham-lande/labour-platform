const LabourProfile = require('../models/LabourProfile');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const {
  getFilteredFallbackProfiles,
  getFallbackLabourProfile,
  getFallbackBookingsForLabour,
} = require('./fallbackStore');

// @desc    Get Labour Dashboard Data
// @route   GET /api/labour/dashboard
// @access  Private (Labour only)
const getLabourDashboard = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const isMongoDB = getDBStatus();

    let profile = null;
    let workRequests = [];

    if (isMongoDB) {
      profile = await LabourProfile.findOne({ userId });
    } else {
      profile = getFallbackLabourProfile(userId);
      workRequests = getFallbackBookingsForLabour(userId);
    }

    const mockDashboardData = {
      stats: {
        activeRequests: workRequests.filter((w) => w.status === 'pending').length || 4,
        assignedJobs: workRequests.filter((w) => w.status === 'accepted' || w.status === 'scheduled').length || 2,
        todayAttendanceStatus: 'Checked-In (Site 4B)',
        monthlyEarnings: profile?.totalEarnings || 38400,
        completedJobsTotal: profile?.completedJobs || 142,
        averageRating: profile?.rating || 4.9,
      },
      workRequests: workRequests.length > 0 ? workRequests : [
        { id: 'WR-9821', title: 'Commercial Mall Wiring Helper', location: 'Bandra West, Mumbai', rate: '₹950/day', duration: '5 Days', customer: 'Nexus Infra Ltd', status: 'pending' },
        { id: 'WR-9824', title: 'High-Voltage Cable Splicing', location: 'Navi Mumbai', rate: '₹1,400/day', duration: '2 Days', customer: 'L&T Infrastructure', status: 'pending' },
        { id: 'WR-9829', title: 'Solar Array Substation Setup', location: 'Thane West', rate: '₹1,250/day', duration: '8 Days', customer: 'GreenTech Energy', status: 'pending' },
      ],
      myJobs: [
        { id: 'JOB-4410', title: 'Smart Building Automation Panel Assembly', site: 'Lower Parel Tech Park', contractor: 'Apex Buildcon', duration: 'Aug 20 - Aug 28', status: 'in_progress', payout: '₹10,800' },
        { id: 'JOB-4389', title: 'Datacenter Backup Generator Wiring', site: 'BKC Financial Hub', contractor: 'Reliance Infra', duration: 'Aug 10 - Aug 18', status: 'completed', payout: '₹12,600' },
      ],
      recentEarnings: [
        { id: 'TXN-9901', date: '2026-08-22', description: 'Weekly Payout (Job #JOB-4389)', amount: 12600, status: 'transferred' },
        { id: 'TXN-9844', date: '2026-08-15', description: 'Overtime Allowance (Site 4B)', amount: 3200, status: 'transferred' },
      ],
      notifications: [
        { id: 1, type: 'info', text: 'New urgent electrical work request available in Bandra West', time: '10 mins ago' },
        { id: 2, type: 'success', text: 'Attendance confirmed for Site 4B. Check-in logged at 08:45 AM', time: '5 hours ago' },
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

// @desc    Search & Discover Labour Profiles
// @route   GET /api/labour/profiles
// @access  Public / Private
const getLabourProfiles = async (req, res) => {
  try {
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const results = getFilteredFallbackProfiles(req.query);
      return res.json({
        success: true,
        count: results.length,
        data: results,
      });
    }

    const { search, category, location, minRating, minExp, maxPrice, availability, verified, sort, distance } = req.query;
    let query = {};

    if (category && category !== 'All') {
      query.workCategories = category;
    }

    if (location && location !== 'All') {
      query['location.city'] = new RegExp(location, 'i');
    }

    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    if (minExp) {
      query.experienceYears = { $gte: parseInt(minExp, 10) };
    }

    if (maxPrice) {
      query.dailyRate = { $lte: parseInt(maxPrice, 10) };
    }

    if (availability && availability !== 'All') {
      query.availabilityStatus = availability.toLowerCase();
    }

    let profiles = await LabourProfile.find(query).populate('userId', 'fullName email mobileNumber avatar isVerified');

    if (search) {
      const term = search.toLowerCase();
      profiles = profiles.filter(
        (p) =>
          p.userId?.fullName?.toLowerCase().includes(term) ||
          p.primarySkill?.toLowerCase().includes(term) ||
          p.skills?.some((s) => s.toLowerCase().includes(term)) ||
          p.location?.city?.toLowerCase().includes(term)
      );
    }

    if (verified === 'true' || verified === true) {
      profiles = profiles.filter((p) => p.userId?.isVerified === true);
    }

    // Distance filtering simulation
    if (distance && distance !== 'any') {
      const maxKm = distance === 'within_5km' ? 5 : distance === 'within_10km' ? 10 : 25;
      profiles = profiles.filter((p) => (p.distanceKm || 4) <= maxKm);
    }

    if (sort === 'highest_rated') {
      profiles.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sort === 'most_experienced') {
      profiles.sort((a, b) => (b.experienceYears || 0) - (a.experienceYears || 0));
    } else if (sort === 'lowest_price') {
      profiles.sort((a, b) => (a.dailyRate || 0) - (b.dailyRate || 0));
    } else if (sort === 'highest_price') {
      profiles.sort((a, b) => (b.dailyRate || 0) - (a.dailyRate || 0));
    } else if (sort === 'most_jobs') {
      profiles.sort((a, b) => (b.completedJobs || 0) - (a.completedJobs || 0));
    }

    return res.json({
      success: true,
      count: profiles.length,
      data: profiles,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Smart Labour Recommendation AI Match Engine
// @route   GET /api/labour/recommendations
// @access  Private / Public
const getSmartRecommendations = async (req, res) => {
  try {
    const { category, city, maxBudget, requiredSkills } = req.query;
    const isMongoDB = getDBStatus();
    let profiles = [];

    if (!isMongoDB) {
      profiles = getFilteredFallbackProfiles({});
    } else {
      profiles = await LabourProfile.find({ availabilityStatus: 'available' })
        .populate('userId', 'fullName email mobileNumber avatar isVerified');
    }

    // Calculate AI match scores (0 - 100%) for each available worker
    const recommendations = profiles.map((p) => {
      let skillScore = 30; // default base match
      if (category && (p.workCategories?.includes(category) || p.primarySkill?.includes(category))) {
        skillScore = 30;
      } else {
        skillScore = 18;
      }

      let locationScore = 25;
      if (city && p.location?.city?.toLowerCase() === city.toLowerCase()) {
        locationScore = 25;
      } else {
        locationScore = 15;
      }

      const expScore = Math.min(20, (p.experienceYears || 5) * 2.5);
      const ratingScore = Math.min(15, ((p.rating || 4.5) / 5) * 15);
      
      let priceScore = 10;
      if (maxBudget && p.dailyRate) {
        priceScore = p.dailyRate <= parseInt(maxBudget, 10) ? 10 : 5;
      }

      const totalMatchScore = Math.round(skillScore + locationScore + expScore + ratingScore + priceScore);

      return {
        ...p,
        matchScore: Math.min(99, Math.max(72, totalMatchScore)),
        matchBreakdown: {
          skillMatch: Math.round((skillScore / 30) * 100),
          locationProximity: Math.round((locationScore / 25) * 100),
          experienceFit: Math.round((expScore / 20) * 100),
          ratingScore: Math.round((ratingScore / 15) * 100),
          priceFit: Math.round((priceScore / 10) * 100),
        },
      };
    });

    recommendations.sort((a, b) => b.matchScore - a.matchScore);

    return res.json({
      success: true,
      count: recommendations.length,
      data: recommendations,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Detailed Public Worker Profile
// @route   GET /api/labour/profiles/:id
// @access  Public / Private
const getLabourProfileById = async (req, res) => {
  try {
    const id = req.params.id;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const results = getFilteredFallbackProfiles({});
      const profile = results.find((p) => p.userId === id || p.user?.id === id);
      if (!profile) {
        return res.status(404).json({ success: false, message: 'Labour worker profile not found' });
      }
      return res.json({ success: true, data: profile });
    }

    const profile = await LabourProfile.findOne({ userId: id }).populate('userId', 'fullName email mobileNumber avatar isVerified');
    if (!profile) {
      return res.status(404).json({ success: false, message: 'Labour worker profile not found' });
    }

    return res.json({ success: true, data: profile });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Worker Profile & Availability Status
// @route   PUT /api/labour/profile/me
// @access  Private (Labour worker only)
const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { skills, workCategories, experienceYears, dailyRate, hourlyRate, location, serviceArea, workingHours, availabilityStatus, bio, avatar } = req.body;

    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const profile = getFallbackLabourProfile(userId);
      if (profile) {
        if (skills) profile.skills = skills;
        if (workCategories) profile.workCategories = workCategories;
        if (experienceYears) profile.experienceYears = experienceYears;
        if (dailyRate) profile.dailyRate = dailyRate;
        if (hourlyRate) profile.hourlyRate = hourlyRate;
        if (location) profile.location = location;
        if (serviceArea) profile.serviceArea = serviceArea;
        if (workingHours) profile.workingHours = workingHours;
        if (availabilityStatus) profile.availabilityStatus = availabilityStatus;
        if (bio) profile.bio = bio;
      }
      if (avatar && req.user) {
        req.user.avatar = avatar;
      }
      return res.json({
        success: true,
        message: 'Profile updated successfully (Demo Mode)!',
        data: profile,
      });
    }

    let profile = await LabourProfile.findOne({ userId });
    if (!profile) {
      profile = await LabourProfile.create({ userId });
    }

    if (skills) profile.skills = skills;
    if (workCategories) profile.workCategories = workCategories;
    if (experienceYears) profile.experienceYears = experienceYears;
    if (dailyRate) profile.dailyRate = dailyRate;
    if (hourlyRate) profile.hourlyRate = hourlyRate;
    if (location) profile.location = location;
    if (serviceArea) profile.serviceArea = serviceArea;
    if (workingHours) profile.workingHours = workingHours;
    if (availabilityStatus) profile.availabilityStatus = availabilityStatus;
    if (bio) profile.bio = bio;

    await profile.save();

    if (avatar) {
      await User.findByIdAndUpdate(userId, { avatar });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully!',
      data: profile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getLabourDashboard,
  getLabourProfiles,
  getSmartRecommendations,
  getLabourProfileById,
  updateMyProfile,
};
