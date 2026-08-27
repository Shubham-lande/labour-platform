const bcrypt = require('bcryptjs');

// Pre-seeded Users
const fallbackUsers = [
  {
    _id: '65f0a0000000000000000001',
    fullName: 'System Enterprise Admin',
    email: 'admin@labourhub.com',
    mobileNumber: '+91 9876543210',
    passwordHash: '$2a$10$Rz.0LqD0YxW0Vp1fV8yJ3.eT.O2j/XnE0J5aP.q4R7w3Y9kK1Z2W3',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    isVerified: true,
    status: 'active',
    createdAt: new Date('2026-01-01'),
  },
  {
    _id: '65f0a0000000000000000002',
    fullName: 'Mol Patil',
    email: 'labour@labourhub.com',
    mobileNumber: '+91 9812345678',
    passwordHash: '$2a$10$Rz.0LqD0YxW0Vp1fV8yJ3.eT.O2j/XnE0J5aP.q4R7w3Y9kK1Z2W3',
    role: 'labour',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    isVerified: true,
    status: 'active',
    createdAt: new Date('2026-01-15'),
  },
  {
    _id: '65f0a0000000000000000003',
    fullName: 'Apex Buildcon Pvt Ltd',
    email: 'customer@labourhub.com',
    mobileNumber: '+91 9988776655',
    passwordHash: '$2a$10$Rz.0LqD0YxW0Vp1fV8yJ3.eT.O2j/XnE0J5aP.q4R7w3Y9kK1Z2W3',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    isVerified: true,
    status: 'active',
    createdAt: new Date('2026-02-01'),
  },

  // Additional Skilled Workers for Search & Discovery
  {
    _id: '65f0a0000000000000000004',
    fullName: 'Vikram Singh (Master Plumber)',
    email: 'vikram.plumber@labourhub.com',
    mobileNumber: '+91 9822334455',
    passwordHash: '$2a$10$Rz.0LqD0YxW0Vp1fV8yJ3.eT.O2j/XnE0J5aP.q4R7w3Y9kK1Z2W3',
    role: 'labour',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    isVerified: true,
    status: 'active',
  },
  {
    _id: '65f0a0000000000000000005',
    fullName: 'Sanjay Sharma (Civil Mason)',
    email: 'sanjay.mason@labourhub.com',
    mobileNumber: '+91 9833445566',
    passwordHash: '$2a$10$Rz.0LqD0YxW0Vp1fV8yJ3.eT.O2j/XnE0J5aP.q4R7w3Y9kK1Z2W3',
    role: 'labour',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    isVerified: true,
    status: 'active',
  },
  {
    _id: '65f0a0000000000000000006',
    fullName: 'Amitabh Verma (HVAC Tech)',
    email: 'amitabh.hvac@labourhub.com',
    mobileNumber: '+91 9844556677',
    passwordHash: '$2a$10$Rz.0LqD0YxW0Vp1fV8yJ3.eT.O2j/XnE0J5aP.q4R7w3Y9kK1Z2W3',
    role: 'labour',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250',
    isVerified: false, // Unverified demo example
    status: 'active',
  },
  {
    _id: '65f0a0000000000000000007',
    fullName: 'Ramesh Carpenter',
    email: 'ramesh.carpenter@labourhub.com',
    mobileNumber: '+91 9855667788',
    passwordHash: '$2a$10$Rz.0LqD0YxW0Vp1fV8yJ3.eT.O2j/XnE0J5aP.q4R7w3Y9kK1Z2W3',
    role: 'labour',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250',
    isVerified: true,
    status: 'active',
  },
];

const fallbackLabourProfiles = {
  '65f0a0000000000000000002': {
    userId: '65f0a0000000000000000002',
    primarySkill: 'Industrial Electrician',
    skills: ['Electrical Wiring', 'High Voltage Switchgear', 'Solar Installation', 'HVAC Controls'],
    workCategories: ['Certified Electricians', 'Solar & Renewable', 'Industrial Maintenance'],
    experienceYears: 7,
    dailyRate: 1200,
    hourlyRate: 180,
    location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    serviceArea: 'Bandra, Lower Parel, BKC & Navi Mumbai',
    workingHours: '08:00 AM - 06:00 PM (Mon-Sat)',
    availabilityStatus: 'available',
    rating: 4.9,
    completedJobs: 142,
    totalEarnings: 184000,
    verificationDocs: { idCardUploaded: true, skillsCertificate: true, policeVerification: true },
    bio: 'Certified Grade-A Industrial Electrician with 7+ years of experience on commercial towers & high-voltage sub-stations.',
    reviews: [
      { customerName: 'Apex Buildcon Ltd', rating: 5, comment: 'Punctual, highly skilled electrical splicing work on Tower A.', date: '2026-08-10' },
      { customerName: 'L&T Infrastructure', rating: 4.9, comment: 'Completed complex distribution panel assembly ahead of deadline.', date: '2026-07-28' },
    ],
    workHistory: [
      { jobTitle: 'Datacenter Backup Generator Wiring', clientName: 'Reliance Infra', duration: '8 Days', amount: '₹12,600', rating: 5.0 },
      { jobTitle: 'Substation Transformer Setup', clientName: 'Adani Electricity', duration: '12 Days', amount: '₹18,000', rating: 4.8 },
    ],
  },

  '65f0a0000000000000000004': {
    userId: '65f0a0000000000000000004',
    primarySkill: 'Master Plumber & Pipefitter',
    skills: ['Commercial Pipefitting', 'Hydraulic Testing', 'Drainage Systems', 'Sanitary Plumbing'],
    workCategories: ['Master Plumbers & Pipefitters', 'Water & Drainage'],
    experienceYears: 9,
    dailyRate: 1100,
    hourlyRate: 160,
    location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400051' },
    serviceArea: 'BKC, Worli, Dadar & Thane',
    workingHours: '07:30 AM - 05:30 PM (Mon-Sat)',
    availabilityStatus: 'available',
    rating: 4.85,
    completedJobs: 118,
    totalEarnings: 152000,
    verificationDocs: { idCardUploaded: true, skillsCertificate: true, policeVerification: true },
    bio: 'Expert master plumber specializing in high-rise pressure testing and commercial chilled water piping.',
    reviews: [
      { customerName: 'Godrej Properties', rating: 4.9, comment: 'Excellent pipe alignment and zero leakage on test.', date: '2026-08-05' },
    ],
    workHistory: [
      { jobTitle: 'Commercial Mall Chilled Water Lines', clientName: 'Phoenix Mills', duration: '6 Days', amount: '₹9,600', rating: 4.8 },
    ],
  },

  '65f0a0000000000000000005': {
    userId: '65f0a0000000000000000005',
    primarySkill: 'Civil & Masonry Specialist',
    skills: ['Brickwork', 'Concrete Casting', 'Plastering & Rendering', 'Tile Laying'],
    workCategories: ['Civil & Masonry Specialists', 'Structural Concrete'],
    experienceYears: 6,
    dailyRate: 950,
    hourlyRate: 140,
    location: { city: 'Navi Mumbai', state: 'Maharashtra', pincode: '400703' },
    serviceArea: 'Navi Mumbai, Bhiwandi & Vashi',
    workingHours: '08:00 AM - 05:00 PM (Mon-Sat)',
    availabilityStatus: 'available',
    rating: 4.75,
    completedJobs: 95,
    totalEarnings: 115000,
    verificationDocs: { idCardUploaded: true, skillsCertificate: false, policeVerification: true },
    bio: 'Precision mason for structural concrete foundations, brickwork partitions, and architectural tile work.',
    reviews: [
      { customerName: 'Bhiwandi Logistics Hub', rating: 4.8, comment: 'Solid masonry work on warehouse perimeter wall.', date: '2026-08-01' },
    ],
    workHistory: [],
  },

  '65f0a0000000000000000006': {
    userId: '65f0a0000000000000000006',
    primarySkill: 'HVAC & Ducting Technician',
    skills: ['Chiller Unit Maintenance', 'Duct Fabrication', 'VRF Air Conditioning', 'Refrigerant Flushing'],
    workCategories: ['HVAC & Ducting Techs'],
    experienceYears: 5,
    dailyRate: 1300,
    hourlyRate: 190,
    location: { city: 'Thane', state: 'Maharashtra', pincode: '400601' },
    serviceArea: 'Thane West, Mulund & Powai',
    workingHours: '09:00 AM - 07:00 PM (Mon-Sat)',
    availabilityStatus: 'busy', // Busy status example for test
    rating: 4.6,
    completedJobs: 64,
    totalEarnings: 88000,
    verificationDocs: { idCardUploaded: true, skillsCertificate: false, policeVerification: false },
    bio: 'Specialized HVAC technician for corporate office ducting and VRF air handling units.',
    reviews: [],
    workHistory: [],
  },

  '65f0a0000000000000000007': {
    userId: '65f0a0000000000000000007',
    primarySkill: 'Master Carpenter & Joiner',
    skills: ['Formwork Shuttering', 'Modular Furniture', 'Door Fitting', 'Scaffolding Decking'],
    workCategories: ['Master Carpenters', 'Formwork & Shuttering'],
    experienceYears: 8,
    dailyRate: 1050,
    hourlyRate: 150,
    location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400011' },
    serviceArea: 'Central Mumbai, Byculla & Chembur',
    workingHours: '08:00 AM - 06:00 PM (Mon-Sat)',
    availabilityStatus: 'available',
    rating: 4.92,
    completedJobs: 130,
    totalEarnings: 168000,
    verificationDocs: { idCardUploaded: true, skillsCertificate: true, policeVerification: true },
    bio: 'Master carpenter specializing in concrete shuttering formwork and commercial interior woodwork.',
    reviews: [
      { customerName: 'K Raheja Corp', rating: 5, comment: 'Flawless formwork shuttering for podium slab.', date: '2026-07-20' },
    ],
    workHistory: [],
  },
};

const fallbackCustomerProfiles = {
  '65f0a0000000000000000003': {
    userId: '65f0a0000000000000000003',
    companyName: 'Apex Buildcon Infrastructure Ltd',
    industry: 'Commercial Construction & Infrastructure',
    address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400051' },
    totalBookings: 38,
    totalSpent: 425000,
    verifiedStatus: 'verified',
  },
};

// Fallback In-memory Bookings
const fallbackBookings = [
  {
    _id: 'BK-7701',
    customer: '65f0a0000000000000000003',
    labour: '65f0a0000000000000000002',
    customerName: 'Apex Buildcon Infrastructure Ltd',
    labourName: 'Mol Patil',
    title: 'Commercial Tower Phase 2 Electrical Crew',
    category: 'Certified Electricians',
    description: 'High-voltage cable splicing and main distribution panel wiring for 12 floors.',
    location: { address: 'Plot 4B, Tech Park', city: 'Mumbai', state: 'Maharashtra', pincode: '400013' },
    startDate: '2026-08-18',
    endDate: '2026-08-28',
    startTime: '08:30 AM',
    workerCount: 4,
    estimatedBudget: 140000,
    specialInstructions: 'Safety helmet and PPE boots mandatory at site entry.',
    status: 'pending',
    createdAt: new Date('2026-08-18'),
  },
  {
    _id: 'BK-7692',
    customer: '65f0a0000000000000000003',
    labour: '65f0a0000000000000000004',
    customerName: 'Apex Buildcon Infrastructure Ltd',
    labourName: 'Vikram Singh',
    title: 'Data Center Plumbing & Chilled Water Lines',
    category: 'Master Plumbers & Pipefitters',
    description: 'Pressure testing and welding of chilled water lines for server hall cooling.',
    location: { address: 'BKC Financial Hub', city: 'Mumbai', state: 'Maharashtra', pincode: '400051' },
    startDate: '2026-08-20',
    endDate: '2026-08-26',
    startTime: '09:00 AM',
    workerCount: 3,
    estimatedBudget: 95000,
    specialInstructions: 'Requires hot work permit clearance.',
    status: 'accepted',
    createdAt: new Date('2026-08-20'),
  },
];

const fallbackOTPs = {};

// Getter Functions
const getFallbackUsers = () => fallbackUsers;

const findFallbackUserByEmail = (email) => {
  return fallbackUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
};

const findFallbackUserByMobile = (mobile) => {
  return fallbackUsers.find((u) => u.mobileNumber === mobile);
};

const getFallbackUserById = (id) => {
  const user = fallbackUsers.find((u) => u._id.toString() === id.toString());
  if (!user) return null;
  const { passwordHash, ...rest } = user;
  return rest;
};

const addFallbackUser = (userObj) => {
  fallbackUsers.push(userObj);
  if (userObj.role === 'labour') {
    fallbackLabourProfiles[userObj._id] = {
      userId: userObj._id,
      primarySkill: 'General Skilled Worker',
      skills: ['General Labor', 'Site Helper'],
      workCategories: ['General Labor'],
      experienceYears: 1,
      dailyRate: 800,
      hourlyRate: 120,
      location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
      serviceArea: 'Mumbai Metropolitan Region',
      workingHours: '08:00 AM - 05:00 PM',
      availabilityStatus: 'available',
      rating: 5.0,
      completedJobs: 0,
      totalEarnings: 0,
      verificationDocs: { idCardUploaded: true, skillsCertificate: false, policeVerification: false },
      bio: 'Ready for site assignments and immediate booking.',
      reviews: [],
      workHistory: [],
    };
  } else if (userObj.role === 'customer') {
    fallbackCustomerProfiles[userObj._id] = {
      userId: userObj._id,
      companyName: userObj.fullName + ' Enterprises',
      industry: 'General Contracting',
      address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
      totalBookings: 0,
      totalSpent: 0,
      verifiedStatus: 'verified',
    };
  }
};

const getFallbackLabourProfile = (userId) => fallbackLabourProfiles[userId] || null;
const getFallbackCustomerProfile = (userId) => fallbackCustomerProfiles[userId] || null;

// Search & Filter Fallback Profiles
const getFilteredFallbackProfiles = (filters = {}) => {
  const { search, category, location, minRating, minExp, maxPrice, availability, verified, sort } = filters;

  let results = Object.values(fallbackLabourProfiles).map((prof) => {
    const user = fallbackUsers.find((u) => u._id === prof.userId);
    return {
      ...prof,
      user: user
        ? {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
            mobileNumber: user.mobileNumber,
            avatar: user.avatar,
            isVerified: user.isVerified,
          }
        : null,
    };
  });

  if (search) {
    const term = search.toLowerCase();
    results = results.filter(
      (p) =>
        p.user?.fullName?.toLowerCase().includes(term) ||
        p.primarySkill?.toLowerCase().includes(term) ||
        p.skills?.some((s) => s.toLowerCase().includes(term)) ||
        p.location?.city?.toLowerCase().includes(term)
    );
  }

  if (category && category !== 'All') {
    results = results.filter((p) => p.workCategories?.includes(category) || p.primarySkill?.includes(category));
  }

  if (location && location !== 'All') {
    results = results.filter((p) => p.location?.city?.toLowerCase() === location.toLowerCase());
  }

  if (minRating) {
    results = results.filter((p) => p.rating >= parseFloat(minRating));
  }

  if (minExp) {
    results = results.filter((p) => p.experienceYears >= parseInt(minExp, 10));
  }

  if (maxPrice) {
    results = results.filter((p) => p.dailyRate <= parseInt(maxPrice, 10));
  }

  if (availability && availability !== 'All') {
    results = results.filter((p) => p.availabilityStatus === availability.toLowerCase());
  }

  if (verified === 'true' || verified === true) {
    results = results.filter((p) => p.user?.isVerified === true);
  }

  // Sorting
  if (sort === 'highest_rated') {
    results.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'most_experienced') {
    results.sort((a, b) => b.experienceYears - a.experienceYears);
  } else if (sort === 'lowest_price') {
    results.sort((a, b) => a.dailyRate - b.dailyRate);
  } else if (sort === 'highest_price') {
    results.sort((a, b) => b.dailyRate - a.dailyRate);
  } else if (sort === 'most_jobs') {
    results.sort((a, b) => b.completedJobs - a.completedJobs);
  }

  return results;
};

// Bookings Fallback Helpers
const addFallbackBooking = (bookingData) => {
  const newBooking = {
    _id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
    ...bookingData,
    status: 'pending',
    createdAt: new Date(),
  };
  fallbackBookings.unshift(newBooking);
  return newBooking;
};

const getFallbackBookingsForCustomer = (customerId) => {
  return fallbackBookings.filter((b) => b.customer.toString() === customerId.toString());
};

const getFallbackBookingsForLabour = (labourId) => {
  return fallbackBookings.filter((b) => b.labour.toString() === labourId.toString());
};

const updateFallbackBookingStatus = (bookingId, status) => {
  const booking = fallbackBookings.find((b) => b._id === bookingId);
  if (booking) {
    booking.status = status;
    return booking;
  }
  return null;
};

const storeFallbackOTP = (identifier, otp) => {
  fallbackOTPs[identifier] = {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000,
  };
};

const verifyFallbackOTP = (identifier, otp) => {
  const record = fallbackOTPs[identifier];
  if (!record) return false;
  if (Date.now() > record.expiresAt) return false;
  return record.otp === otp;
};

// Fallback Projects
const fallbackProjects = [
  {
    _id: 'PRJ-901',
    customer: '65f0a0000000000000000003',
    customerName: 'Apex Buildcon Infrastructure Ltd',
    name: 'Smart Building Automation & High-Voltage Panel Wiring',
    category: 'Certified Electricians',
    description: 'Complete high-voltage sub-station switchgear assembly, smart automation panel wiring, and safety distribution testing.',
    location: { address: 'Plot 4B, Commercial Tech Park', city: 'Mumbai', state: 'Maharashtra', pincode: '400013' },
    requiredSkills: ['Electrical Wiring', 'High Voltage Switchgear', 'Solar Installation'],
    workerCount: 3,
    startDate: '2026-08-20',
    deadline: '2026-09-10',
    budget: 185000,
    priority: 'high',
    status: 'in_progress',
    progressPercentage: 65,
    assignedWorkers: [
      {
        workerId: '65f0a0000000000000000002',
        workerName: 'Rajesh Kumar (Master Electrician)',
        roleTitle: 'Lead Electrician',
        assignmentStatus: 'working',
        assignedAt: new Date('2026-08-19'),
      },
      {
        workerId: '65f0a0000000000000000006',
        workerName: 'Amitabh Verma (HVAC Tech)',
        roleTitle: 'HVAC Control Specialist',
        assignmentStatus: 'accepted',
        assignedAt: new Date('2026-08-19'),
      },
    ],
    activityHistory: [
      { action: 'Project Created', performedBy: 'Apex Buildcon Ltd', timestamp: new Date('2026-08-18'), details: 'Initial project specs logged' },
      { action: 'Labour Assigned', performedBy: 'Apex Buildcon Ltd', timestamp: new Date('2026-08-19'), details: 'Assigned Mol Patil & Amitabh Verma' },
      { action: 'Work Started', performedBy: 'Mol Patil', timestamp: new Date('2026-08-20'), details: 'Site inspection & panel mounting initialized' },
    ],
    createdAt: new Date('2026-08-18'),
  },
  {
    _id: 'PRJ-902',
    customer: '65f0a0000000000000000003',
    customerName: 'Apex Buildcon Infrastructure Ltd',
    name: 'BKC Financial Center Chilled Water Pipe Retrofit',
    category: 'Master Plumbers & Pipefitters',
    description: 'Retrofitting commercial chilled water pressure lines and hydraulic pump testing for 18 stories.',
    location: { address: 'BKC Financial Hub', city: 'Mumbai', state: 'Maharashtra', pincode: '400051' },
    requiredSkills: ['Commercial Pipefitting', 'Hydraulic Testing'],
    workerCount: 4,
    startDate: '2026-09-01',
    deadline: '2026-09-20',
    budget: 240000,
    priority: 'urgent',
    status: 'scheduled',
    progressPercentage: 10,
    assignedWorkers: [
      {
        workerId: '65f0a0000000000000000004',
        workerName: 'Vikram Singh (Master Plumber)',
        roleTitle: 'Master Pipefitter',
        assignmentStatus: 'accepted',
        assignedAt: new Date('2026-08-22'),
      },
    ],
    activityHistory: [
      { action: 'Project Created', performedBy: 'Apex Buildcon Ltd', timestamp: new Date('2026-08-21'), details: 'Upcoming project scheduled' },
    ],
    createdAt: new Date('2026-08-21'),
  },
  {
    _id: 'PRJ-903',
    customer: '65f0a0000000000000000003',
    customerName: 'Apex Buildcon Infrastructure Ltd',
    name: 'Navi Mumbai Warehouse Structural Masonry',
    category: 'Civil & Masonry Specialists',
    description: 'Concrete foundation casting, brickwork perimeter walls, and heavy-load floor plastering.',
    location: { address: 'Sector 18, Vashi', city: 'Navi Mumbai', state: 'Maharashtra', pincode: '400703' },
    requiredSkills: ['Brickwork', 'Concrete Casting', 'Plastering & Rendering'],
    workerCount: 6,
    startDate: '2026-07-01',
    deadline: '2026-08-15',
    budget: 310000,
    priority: 'medium',
    status: 'completed',
    progressPercentage: 100,
    assignedWorkers: [
      {
        workerId: '65f0a0000000000000000005',
        workerName: 'Sanjay Sharma (Civil Mason)',
        roleTitle: 'Lead Mason',
        assignmentStatus: 'completed',
        assignedAt: new Date('2026-06-28'),
      },
    ],
    activityHistory: [
      { action: 'Project Completed', performedBy: 'Sanjay Sharma', timestamp: new Date('2026-08-14'), details: 'Site handed over successfully' },
      { action: 'Customer Approved', performedBy: 'Apex Buildcon Ltd', timestamp: new Date('2026-08-15'), details: 'Quality check passed & approved' },
    ],
    createdAt: new Date('2026-06-28'),
  },
];

// Fallback Attendance Records
const fallbackAttendance = [
  {
    _id: 'ATT-1001',
    worker: '65f0a0000000000000000002',
    workerName: 'Mol Patil',
    project: 'PRJ-901',
    projectName: 'Smart Building Automation & High-Voltage Panel Wiring',
    date: '2026-08-26',
    startTime: '08:30 AM',
    endTime: '05:30 PM',
    breakMinutes: 45,
    totalHours: 8.25,
    status: 'checked_out',
    siteLocation: 'Plot 4B, Commercial Tech Park, Mumbai',
  },
  {
    _id: 'ATT-1002',
    worker: '65f0a0000000000000000002',
    workerName: 'Mol Patil',
    project: 'PRJ-901',
    projectName: 'Smart Building Automation & High-Voltage Panel Wiring',
    date: '2026-08-25',
    startTime: '08:45 AM',
    endTime: '06:00 PM',
    breakMinutes: 30,
    totalHours: 8.75,
    status: 'checked_out',
    siteLocation: 'Plot 4B, Commercial Tech Park, Mumbai',
  },
  {
    _id: 'ATT-1003',
    worker: '65f0a0000000000000000004',
    workerName: 'Vikram Singh',
    project: 'PRJ-902',
    projectName: 'BKC Financial Center Chilled Water Pipe Retrofit',
    date: '2026-08-26',
    startTime: '09:00 AM',
    endTime: null,
    breakMinutes: 30,
    totalHours: 0,
    status: 'checked_in',
    siteLocation: 'BKC Financial Hub, Mumbai',
  },
];

// Fallback Work Updates
const fallbackWorkUpdates = [
  {
    _id: 'UPD-501',
    project: 'PRJ-901',
    worker: '65f0a0000000000000000002',
    workerName: 'Mol Patil',
    description: 'Completed main circuit breaker mounting and high-voltage busbar grounding on Floor 4.',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    progressPercentage: 65,
    createdAt: new Date('2026-08-26T14:30:00Z'),
  },
  {
    _id: 'UPD-500',
    project: 'PRJ-901',
    worker: '65f0a0000000000000000002',
    workerName: 'Mol Patil',
    description: 'Finished primary cable tray routing and conduit installation across North Wing.',
    photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=600',
    progressPercentage: 45,
    createdAt: new Date('2026-08-23T11:15:00Z'),
  },
];

// Project & Attendance Fallback Helper Methods
const getFallbackProjects = (filterStatus = 'all') => {
  if (!filterStatus || filterStatus === 'all') return fallbackProjects;
  if (filterStatus === 'active') return fallbackProjects.filter(p => ['in_progress', 'work_started', 'labour_assigned', 'paused'].includes(p.status));
  if (filterStatus === 'upcoming') return fallbackProjects.filter(p => ['created', 'scheduled'].includes(p.status));
  if (filterStatus === 'completed') return fallbackProjects.filter(p => ['completed', 'customer_approved', 'closed'].includes(p.status));
  if (filterStatus === 'cancelled') return fallbackProjects.filter(p => p.status === 'cancelled');
  return fallbackProjects;
};

const addFallbackProject = (prjData) => {
  const newPrj = {
    _id: 'PRJ-' + Math.floor(1000 + Math.random() * 9000),
    ...prjData,
    status: 'created',
    progressPercentage: 0,
    assignedWorkers: [],
    activityHistory: [
      { action: 'Project Created', performedBy: 'Client Contractor', timestamp: new Date(), details: 'Project specs initialized' },
    ],
    createdAt: new Date(),
  };
  fallbackProjects.unshift(newPrj);
  return newPrj;
};

const getFallbackProjectById = (id) => {
  return fallbackProjects.find((p) => p._id === id) || null;
};

const assignFallbackWorkersToProject = (projectId, workerList) => {
  const prj = fallbackProjects.find((p) => p._id === projectId);
  if (!prj) return null;

  workerList.forEach((w) => {
    const exists = prj.assignedWorkers.some((aw) => aw.workerId === w.workerId);
    if (!exists) {
      prj.assignedWorkers.push({
        workerId: w.workerId,
        workerName: w.workerName,
        roleTitle: w.roleTitle || 'Site Technician',
        assignmentStatus: 'assigned',
        assignedAt: new Date(),
      });
    }
  });

  if (prj.status === 'created') {
    prj.status = 'labour_assigned';
  }
  prj.activityHistory.unshift({
    action: 'Labour Assigned',
    performedBy: 'Client Contractor',
    timestamp: new Date(),
    details: `Assigned ${workerList.length} worker(s) to project.`,
  });

  return prj;
};

const updateFallbackProjectStatus = (projectId, newStatus, details = '') => {
  const prj = fallbackProjects.find((p) => p._id === projectId);
  if (!prj) return null;

  prj.status = newStatus;
  if (newStatus === 'completed') prj.progressPercentage = 100;

  prj.activityHistory.unshift({
    action: `Status: ${newStatus.toUpperCase()}`,
    performedBy: 'User Action',
    timestamp: new Date(),
    details: details || `Project status advanced to ${newStatus}`,
  });

  return prj;
};

const addFallbackWorkUpdate = (projectId, updateData) => {
  const newUpd = {
    _id: 'UPD-' + Math.floor(100 + Math.random() * 900),
    project: projectId,
    ...updateData,
    createdAt: new Date(),
  };
  fallbackWorkUpdates.unshift(newUpd);

  const prj = fallbackProjects.find((p) => p._id === projectId);
  if (prj && updateData.progressPercentage !== undefined) {
    prj.progressPercentage = updateData.progressPercentage;
    if (prj.progressPercentage > 0 && prj.status === 'scheduled') {
      prj.status = 'in_progress';
    }
    prj.activityHistory.unshift({
      action: 'Work Update Added',
      performedBy: updateData.workerName || 'Worker',
      timestamp: new Date(),
      details: `${updateData.description} (${updateData.progressPercentage}%)`,
    });
  }

  return newUpd;
};

const getFallbackWorkUpdates = (projectId) => {
  return fallbackWorkUpdates.filter((u) => u.project === projectId);
};

const addFallbackAttendance = (attData) => {
  const newAtt = {
    _id: 'ATT-' + Math.floor(1000 + Math.random() * 9000),
    ...attData,
    status: attData.endTime ? 'checked_out' : 'checked_in',
    createdAt: new Date(),
  };
  fallbackAttendance.unshift(newAtt);
  return newAtt;
};

const getFallbackAttendance = (workerId, projectId) => {
  let list = fallbackAttendance;
  if (workerId) list = list.filter((a) => a.worker === workerId);
  if (projectId) list = list.filter((a) => a.project === projectId);
  return list;
};

// Phase 4 Fallback Mock Collections

const fallbackPayments = [
  {
    _id: 'PAY-8801',
    project: 'PRJ-901',
    customer: '65f0a0000000000000000003',
    labour: '65f0a0000000000000000002',
    customerName: 'Apex Buildcon Infrastructure Ltd',
    labourName: 'Mol Patil',
    amount: 185000,
    paidAmount: 185000,
    remainingAmount: 0,
    paymentMethod: 'upi_razorpay',
    status: 'paid',
    transactionId: 'TXN-RZP-992011',
    breakdown: { rate: 1200, duration: '15 Days', additionalCharges: 5000 },
    createdAt: new Date('2026-08-25'),
  },
  {
    _id: 'PAY-8802',
    project: 'PRJ-902',
    customer: '65f0a0000000000000000003',
    labour: '65f0a0000000000000000004',
    customerName: 'Apex Buildcon Infrastructure Ltd',
    labourName: 'Vikram Singh',
    amount: 95000,
    paidAmount: 45000,
    remainingAmount: 50000,
    paymentMethod: 'escrow_wallet',
    status: 'partially_paid',
    transactionId: 'TXN-ESC-441029',
    breakdown: { rate: 1100, duration: '8 Days', additionalCharges: 7000 },
    createdAt: new Date('2026-08-22'),
  },
];

const fallbackInvoices = [
  {
    _id: 'INV-1001',
    invoiceNumber: 'INV-2026-0091',
    payment: 'PAY-8801',
    project: 'PRJ-901',
    projectName: 'Smart Building Automation & High-Voltage Panel Wiring',
    customer: '65f0a0000000000000000003',
    labour: '65f0a0000000000000000002',
    customerName: 'Apex Buildcon Infrastructure Ltd',
    labourName: 'Mol Patil',
    workDescription: 'High-voltage sub-station switchgear assembly and automation panel wiring.',
    duration: '15 Days',
    dailyRate: 1200,
    additionalCharges: 5000,
    taxAmount: 32400,
    totalAmount: 185000,
    paymentStatus: 'paid',
    transactionId: 'TXN-RZP-992011',
    issueDate: new Date('2026-08-25'),
  },
];

const fallbackReviews = [
  {
    _id: 'REV-301',
    project: 'PRJ-903',
    customer: '65f0a0000000000000000003',
    labour: '65f0a0000000000000000002',
    customerName: 'Apex Buildcon Infrastructure Ltd',
    labourName: 'Mol Patil',
    rating: 5,
    qualityRating: 5,
    behaviourRating: 5,
    punctualityRating: 5,
    skillRating: 5,
    comment: 'Punctual, highly skilled electrical splicing work on Tower A. Zero defects logged on quality audit.',
    createdAt: new Date('2026-08-10'),
  },
];

const fallbackMessages = [
  {
    _id: 'MSG-101',
    project: 'PRJ-901',
    sender: '65f0a0000000000000000003',
    senderName: 'Apex Buildcon Ltd',
    senderRole: 'customer',
    text: 'Hi Mol, please ensure safety helmets are worn during high-voltage busbar assembly.',
    photoUrl: '',
    documentUrl: '',
    location: { address: '', city: '' },
    isRead: true,
    createdAt: new Date('2026-08-26T10:00:00Z'),
  },
  {
    _id: 'MSG-102',
    project: 'PRJ-901',
    sender: '65f0a0000000000000000002',
    senderName: 'Mol Patil',
    senderRole: 'labour',
    text: 'Understood. PPE safety gear is active. Completed Floor 4 panel grounding.',
    photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600',
    documentUrl: '',
    location: { address: 'Plot 4B Tech Park', city: 'Mumbai' },
    isRead: false,
    createdAt: new Date('2026-08-26T10:15:00Z'),
  },
];

const fallbackNotifications = [
  {
    _id: 'NOT-1',
    user: '65f0a0000000000000000003',
    title: 'Work Request Accepted',
    text: 'Mol Patil accepted your work booking for Commercial Tower Phase 2.',
    type: 'booking_accepted',
    link: '/dashboard/customer',
    isRead: false,
    createdAt: new Date('2026-08-26T11:00:00Z'),
  },
  {
    _id: 'NOT-2',
    user: '65f0a0000000000000000003',
    title: 'Work Progress Update Logged',
    text: 'Site update posted for Smart Building Automation (65% progress).',
    type: 'work_started',
    link: '/dashboard/customer',
    isRead: false,
    createdAt: new Date('2026-08-26T14:30:00Z'),
  },
  {
    _id: 'NOT-3',
    user: '65f0a0000000000000000002',
    title: 'New Work Assignment',
    text: 'You were assigned to Metro Substation Electrical Installation by Apex Buildcon.',
    type: 'worker_assigned',
    link: '/dashboard/labour',
    isRead: true,
    createdAt: new Date('2026-08-26T09:00:00Z'),
  },
];

const fallbackComplaints = [
  {
    _id: 'CMP-401',
    raisedBy: '65f0a0000000000000000003',
    userInvolved: '65f0a0000000000000000006',
    raisedByName: 'Apex Buildcon Infrastructure Ltd',
    userInvolvedName: 'Amitabh Verma (HVAC Tech)',
    project: 'PRJ-901',
    complaintType: 'attendance_absence',
    description: 'Worker reported 45 minutes late for site inspection on August 24.',
    evidenceUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd',
    amountInvolved: 2500,
    status: 'under_review',
    createdAt: new Date('2026-08-25'),
  },
];

// Helper Functions for Phase 4

const addFallbackPayment = (payData) => {
  if (payData.amount < 0 || payData.paidAmount < 0) {
    throw new Error('Payment amounts must be non-negative.');
  }

  const txnId = 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase();
  const newPay = {
    _id: 'PAY-' + Math.floor(1000 + Math.random() * 9000),
    ...payData,
    transactionId: txnId,
    status: payData.paidAmount >= payData.amount ? 'paid' : payData.paidAmount > 0 ? 'partially_paid' : 'pending',
    remainingAmount: Math.max(0, payData.amount - (payData.paidAmount || payData.amount)),
    createdAt: new Date(),
  };

  fallbackPayments.unshift(newPay);

  // Auto-generate invoice
  const invNum = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);
  const newInv = {
    _id: 'INV-' + Math.floor(1000 + Math.random() * 9000),
    invoiceNumber: invNum,
    payment: newPay._id,
    project: payData.project,
    customer: payData.customer,
    labour: payData.labour,
    customerName: payData.customerName || 'Apex Buildcon Ltd',
    labourName: payData.labourName || 'Skilled Labour',
    workDescription: payData.workDescription || 'Site Labour Services',
    duration: payData.duration || '5 Days',
    dailyRate: payData.dailyRate || 1200,
    additionalCharges: payData.additionalCharges || 0,
    taxAmount: Math.round(payData.amount * 0.18),
    totalAmount: payData.amount,
    paymentStatus: newPay.status === 'paid' ? 'paid' : 'pending',
    transactionId: txnId,
    issueDate: new Date(),
  };
  fallbackInvoices.unshift(newInv);

  return { payment: newPay, invoice: newInv };
};

const getFallbackPayments = (userId) => {
  if (!userId) return fallbackPayments;
  return fallbackPayments.filter((p) => p.customer.toString() === userId.toString() || p.labour.toString() === userId.toString());
};

const getFallbackInvoices = (userId) => {
  if (!userId) return fallbackInvoices;
  return fallbackInvoices.filter((i) => i.customer.toString() === userId.toString() || i.labour.toString() === userId.toString());
};

const getFallbackInvoiceById = (id) => {
  return fallbackInvoices.find((i) => i._id === id || i.invoiceNumber === id) || null;
};

const addFallbackReview = (revData) => {
  // Prevent duplicate reviews for the same project/booking by the same customer
  const isDuplicate = fallbackReviews.some(
    (r) =>
      (r.project && r.project === revData.project) &&
      r.customer.toString() === revData.customer.toString() &&
      r.labour.toString() === revData.labour.toString()
  );

  if (isDuplicate) {
    throw new Error('A review has already been submitted for this completed job.');
  }

  const newRev = {
    _id: 'REV-' + Math.floor(100 + Math.random() * 900),
    ...revData,
    createdAt: new Date(),
  };

  fallbackReviews.unshift(newRev);

  // Update labour profile rating stats
  const labourProf = fallbackLabourProfiles[revData.labour];
  if (labourProf) {
    if (!labourProf.reviews) labourProf.reviews = [];
    labourProf.reviews.unshift({
      customerName: revData.customerName || 'Contractor',
      rating: revData.rating,
      comment: revData.comment,
      date: new Date().toISOString().split('T')[0],
    });
    const totalRating = labourProf.reviews.reduce((acc, r) => acc + r.rating, 0);
    labourProf.rating = Math.round((totalRating / labourProf.reviews.length) * 10) / 10;
  }

  return newRev;
};

const getFallbackReviewsForLabour = (labourId) => {
  return fallbackReviews.filter((r) => r.labour.toString() === labourId.toString());
};

const addFallbackMessage = (msgData) => {
  const newMsg = {
    _id: 'MSG-' + Math.floor(100 + Math.random() * 900),
    ...msgData,
    isRead: false,
    createdAt: new Date(),
  };
  fallbackMessages.push(newMsg);
  return newMsg;
};

const getFallbackMessages = (projectId) => {
  return fallbackMessages.filter((m) => m.project === projectId);
};

const addFallbackNotification = (notifData) => {
  const newNotif = {
    _id: 'NOT-' + Math.floor(100 + Math.random() * 900),
    ...notifData,
    isRead: false,
    createdAt: new Date(),
  };
  fallbackNotifications.unshift(newNotif);
  return newNotif;
};

const getFallbackNotifications = (userId) => {
  if (!userId) return fallbackNotifications;
  return fallbackNotifications.filter((n) => n.user.toString() === userId.toString());
};

const markFallbackNotificationsRead = (userId) => {
  fallbackNotifications.forEach((n) => {
    if (!userId || n.user.toString() === userId.toString()) {
      n.isRead = true;
    }
  });
};

const addFallbackComplaint = (cmpData) => {
  if (cmpData.amountInvolved < 0) {
    throw new Error('Amount involved in complaint must be non-negative.');
  }

  const newCmp = {
    _id: 'CMP-' + Math.floor(100 + Math.random() * 900),
    ...cmpData,
    status: 'submitted',
    createdAt: new Date(),
  };
  fallbackComplaints.unshift(newCmp);
  return newCmp;
};

const getFallbackComplaints = (userId) => {
  if (!userId) return fallbackComplaints;
  return fallbackComplaints.filter((c) => c.raisedBy.toString() === userId.toString() || c.userInvolved?.toString() === userId.toString());
};

const updateFallbackComplaintStatus = (complaintId, status, resolutionNotes = '') => {
  const cmp = fallbackComplaints.find((c) => c._id === complaintId);
  if (cmp) {
    cmp.status = status;
    if (resolutionNotes) cmp.resolutionNotes = resolutionNotes;
    return cmp;
  }
  return null;
};

// Phase 5 Fallback Collections & Helpers

const fallbackActivityLogs = [
  {
    _id: 'LOG-9001',
    event: 'Escrow Milestone Payment Authorized',
    category: 'payment',
    performedBy: 'Apex Buildcon Ltd',
    actorRole: 'customer',
    targetRecordId: 'PAY-8801',
    details: 'Authorized ₹185,000 for Smart Building Automation project.',
    severity: 'success',
    createdAt: new Date('2026-08-26T15:10:00Z'),
  },
  {
    _id: 'LOG-9002',
    event: 'Labour Shift Check-In Logged',
    category: 'work_status',
    performedBy: 'Mol Patil',
    actorRole: 'labour',
    targetRecordId: 'ATT-1001',
    details: 'Shift started at Plot 4B Tech Park site at 08:30 AM.',
    severity: 'info',
    createdAt: new Date('2026-08-26T08:30:00Z'),
  },
  {
    _id: 'LOG-9003',
    event: 'Work Booking Request Created',
    category: 'booking',
    performedBy: 'Apex Buildcon Ltd',
    actorRole: 'customer',
    targetRecordId: 'BK-7701',
    details: 'Booking created for Certified Electricians crew.',
    severity: 'info',
    createdAt: new Date('2026-08-25T14:00:00Z'),
  },
  {
    _id: 'LOG-9004',
    event: 'Aadhaar Identity KYC Uploaded',
    category: 'verification',
    performedBy: 'Vikram Singh',
    actorRole: 'labour',
    targetRecordId: '65f0a0000000000000000004',
    details: 'Trade license and Aadhaar documents submitted for admin approval.',
    severity: 'warning',
    createdAt: new Date('2026-08-24T11:20:00Z'),
  },
];

const fallbackVerifications = [
  {
    _id: 'VER-881',
    userId: '65f0a0000000000000000004',
    userName: 'Vikram Singh',
    userRole: 'labour',
    docType: 'Trade License & Aadhaar Identity Proof',
    docUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c',
    status: 'under_review',
    submissionDate: new Date('2026-08-24'),
    rejectionReason: '',
  },
  {
    _id: 'VER-882',
    userId: '65f0a0000000000000000006',
    userName: 'Amitabh Verma (HVAC Tech)',
    userRole: 'labour',
    docType: 'HVAC Competency Certificate',
    docUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758',
    status: 'under_review',
    submissionDate: new Date('2026-08-23'),
    rejectionReason: '',
  },
  {
    _id: 'VER-883',
    userId: '65f0a0000000000000000002',
    userName: 'Rajesh Kumar',
    userRole: 'labour',
    docType: 'Master Electrical Trade License',
    docUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    status: 'verified',
    submissionDate: new Date('2026-08-15'),
    rejectionReason: '',
  },
];

const getFallbackActivityLogs = () => fallbackActivityLogs;

const getFallbackVerifications = () => fallbackVerifications;

const updateFallbackVerificationStatus = (verId, status, rejectionReason = '') => {
  const ver = fallbackVerifications.find((v) => v._id === verId || v.userId === verId);
  if (ver) {
    ver.status = status;
    if (rejectionReason) ver.rejectionReason = rejectionReason;

    // Update user verification status in profile
    const user = fallbackUsers.find((u) => u._id === ver.userId);
    if (user) {
      user.isVerified = status === 'verified';
    }
    return ver;
  }
  return null;
};

const updateFallbackUserStatus = (userId, status) => {
  const user = fallbackUsers.find((u) => u._id === userId);
  if (user) {
    user.status = status; // 'active' | 'suspended' | 'blocked' | 'deleted'
    return user;
  }
  return null;
};

module.exports = {
  getFallbackUsers,
  findFallbackUserByEmail,
  findFallbackUserByMobile,
  getFallbackUserById,
  addFallbackUser,
  getFallbackLabourProfile,
  getFallbackCustomerProfile,
  getFilteredFallbackProfiles,
  addFallbackBooking,
  getFallbackBookingsForCustomer,
  getFallbackBookingsForLabour,
  updateFallbackBookingStatus,
  storeFallbackOTP,
  verifyFallbackOTP,

  // Phase 3 Exports
  getFallbackProjects,
  addFallbackProject,
  getFallbackProjectById,
  assignFallbackWorkersToProject,
  updateFallbackProjectStatus,
  addFallbackWorkUpdate,
  getFallbackWorkUpdates,
  addFallbackAttendance,
  getFallbackAttendance,

  // Phase 4 Exports
  addFallbackPayment,
  getFallbackPayments,
  getFallbackInvoices,
  getFallbackInvoiceById,
  addFallbackReview,
  getFallbackReviewsForLabour,
  addFallbackMessage,
  getFallbackMessages,
  addFallbackNotification,
  getFallbackNotifications,
  markFallbackNotificationsRead,
  addFallbackComplaint,
  getFallbackComplaints,
  updateFallbackComplaintStatus,

  // Phase 5 Exports
  getFallbackActivityLogs,
  getFallbackVerifications,
  updateFallbackVerificationStatus,
  updateFallbackUserStatus,
};
