const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const LabourProfile = require('./models/LabourProfile');
const CustomerProfile = require('./models/CustomerProfile');
const Booking = require('./models/Booking');
const Skill = require('./models/Skill');
const Category = require('./models/Category');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/labour_platform');

    await User.deleteMany({});
    await LabourProfile.deleteMany({});
    await CustomerProfile.deleteMany({});
    await Booking.deleteMany({});
    await Skill.deleteMany({});
    await Category.deleteMany({});

    console.log('Cleared old database collections.');

    const salt = await bcrypt.genSalt(10);
    const commonPassword = await bcrypt.hash('Admin@1234', salt);

    // 1. Categories & Skills
    const categories = await Category.insertMany([
      { name: 'Certified Electricians', icon: 'Zap', description: 'High voltage switchgear, industrial wiring, solar substation.', activeWorkersCount: 42 },
      { name: 'Master Plumbers & Pipefitters', icon: 'Droplets', description: 'Chilled water lines, hydraulic pressure testing, commercial piping.', activeWorkersCount: 38 },
      { name: 'Civil & Masonry Specialists', icon: 'Building', description: 'Brickwork, concrete casting, plastering, shuttering foundation.', activeWorkersCount: 56 },
      { name: 'HVAC & Ducting Techs', icon: 'Wind', description: 'Air handling units, VRF system maintenance, duct fabrication.', activeWorkersCount: 29 },
      { name: 'Master Carpenters', icon: 'Hammer', description: 'Formwork shuttering, modular joinery, scaffolding decking.', activeWorkersCount: 34 },
    ]);

    await Skill.insertMany([
      { name: 'Electrical Wiring', category: 'Certified Electricians', demandLevel: 'High', averageDailyRate: 1200 },
      { name: 'High Voltage Switchgear', category: 'Certified Electricians', demandLevel: 'High', averageDailyRate: 1500 },
      { name: 'Commercial Pipefitting', category: 'Master Plumbers & Pipefitters', demandLevel: 'High', averageDailyRate: 1100 },
      { name: 'Hydraulic Pressure Testing', category: 'Master Plumbers & Pipefitters', demandLevel: 'High', averageDailyRate: 1300 },
      { name: 'Formwork Shuttering', category: 'Master Carpenters', demandLevel: 'Medium', averageDailyRate: 1050 },
      { name: 'Brickwork Partitioning', category: 'Civil & Masonry Specialists', demandLevel: 'Standard', averageDailyRate: 950 },
      { name: 'Chiller Unit Overhaul', category: 'HVAC & Ducting Techs', demandLevel: 'High', averageDailyRate: 1400 },
    ]);

    // 2. Admin User
    const admin = await User.create({
      fullName: 'System Enterprise Admin',
      email: 'admin@labourhub.com',
      mobileNumber: '+91 9876543210',
      password: commonPassword,
      role: 'admin',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    });

    // 3. Labour User 1 (Rajesh)
    const labourPassword = await bcrypt.hash('Labour@1234', salt);
    const labour1 = await User.create({
      fullName: 'Mol Patil (Master Electrician)',
      email: 'labour@labourhub.com',
      mobileNumber: '+91 9812345678',
      password: labourPassword,
      role: 'labour',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    });

    await LabourProfile.create({
      userId: labour1._id,
      skills: ['Electrical Wiring', 'High Voltage Switchgear', 'Solar Installation', 'HVAC Controls'],
      workCategories: ['Certified Electricians'],
      experienceYears: 7,
      dailyRate: 1200,
      hourlyRate: 180,
      location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
      availabilityStatus: 'available',
      rating: 4.9,
      completedJobs: 142,
      totalEarnings: 184000,
      verificationDocs: { idCardUploaded: true, skillsCertificate: true, policeVerification: true },
      bio: 'Certified Grade-A Industrial Electrician with 7+ years on commercial & high-rise projects.',
    });

    // 4. Labour User 2 (Vikram - Plumber)
    const labour2 = await User.create({
      fullName: 'Vikram Singh (Master Plumber)',
      email: 'vikram.plumber@labourhub.com',
      mobileNumber: '+91 9822334455',
      password: labourPassword,
      role: 'labour',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    });

    await LabourProfile.create({
      userId: labour2._id,
      skills: ['Commercial Pipefitting', 'Hydraulic Testing', 'Drainage Systems', 'Sanitary Plumbing'],
      workCategories: ['Master Plumbers & Pipefitters'],
      experienceYears: 9,
      dailyRate: 1100,
      hourlyRate: 160,
      location: { city: 'Mumbai', state: 'Maharashtra', pincode: '400051' },
      availabilityStatus: 'available',
      rating: 4.85,
      completedJobs: 118,
      totalEarnings: 152000,
      verificationDocs: { idCardUploaded: true, skillsCertificate: true, policeVerification: true },
      bio: 'Expert master plumber specializing in high-rise pressure testing and commercial chilled water piping.',
    });

    // 5. Labour User 3 (Sanjay - Mason)
    const labour3 = await User.create({
      fullName: 'Sanjay Sharma (Civil Mason)',
      email: 'sanjay.mason@labourhub.com',
      mobileNumber: '+91 9833445566',
      password: labourPassword,
      role: 'labour',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250',
    });

    await LabourProfile.create({
      userId: labour3._id,
      skills: ['Brickwork', 'Concrete Casting', 'Plastering & Rendering', 'Tile Laying'],
      workCategories: ['Civil & Masonry Specialists'],
      experienceYears: 6,
      dailyRate: 950,
      hourlyRate: 140,
      location: { city: 'Navi Mumbai', state: 'Maharashtra', pincode: '400703' },
      availabilityStatus: 'available',
      rating: 4.75,
      completedJobs: 95,
      totalEarnings: 115000,
      verificationDocs: { idCardUploaded: true, skillsCertificate: true, policeVerification: true },
      bio: 'Precision mason for structural concrete foundations, brickwork partitions, and architectural tile work.',
    });

    // 6. Customer User
    const customerPassword = await bcrypt.hash('Customer@1234', salt);
    const customer = await User.create({
      fullName: 'Apex Buildcon Pvt Ltd',
      email: 'customer@labourhub.com',
      mobileNumber: '+91 9988776655',
      password: customerPassword,
      role: 'customer',
      isVerified: true,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    });

    await CustomerProfile.create({
      userId: customer._id,
      companyName: 'Apex Buildcon Infrastructure Ltd',
      industry: 'Commercial Construction & Infrastructure',
      address: { city: 'Mumbai', state: 'Maharashtra', pincode: '400051' },
      totalBookings: 38,
      totalSpent: 425000,
      verifiedStatus: 'verified',
    });

    // 7. Seed Sample Booking
    await Booking.create({
      customer: customer._id,
      labour: labour1._id,
      title: 'Commercial Tower Phase 2 Electrical Crew',
      category: 'Certified Electricians',
      description: 'High-voltage cable splicing and main distribution panel wiring for 12 floors.',
      location: { address: 'Plot 4B, Tech Park', city: 'Mumbai', state: 'Maharashtra', pincode: '400013' },
      startDate: new Date('2026-08-18'),
      endDate: new Date('2026-08-28'),
      startTime: '08:30 AM',
      workerCount: 4,
      estimatedBudget: 140000,
      specialInstructions: 'Safety helmet and PPE boots mandatory at site entry.',
      status: 'pending',
    });

    console.log('Seeding completed successfully!');
    console.log('Test Accounts Created:');
    console.log(' - Admin:    admin@labourhub.com | Admin@1234');
    console.log(' - Labour:   labour@labourhub.com | Labour@1234');
    console.log(' - Customer: customer@labourhub.com | Customer@1234');

    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error.message);
    process.exit(1);
  }
};

seedData();
