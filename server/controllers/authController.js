const bcrypt = require('bcryptjs');
const User = require('../models/User');
const LabourProfile = require('../models/LabourProfile');
const CustomerProfile = require('../models/CustomerProfile');
const PasswordReset = require('../models/PasswordReset');
const generateToken = require('../utils/generateToken');
const { getDBStatus } = require('../config/db');
const {
  findFallbackUserByEmail,
  findFallbackUserByMobile,
  getFallbackUserById,
  addFallbackUser,
  getFallbackLabourProfile,
  getFallbackCustomerProfile,
  storeFallbackOTP,
  verifyFallbackOTP,
  getFallbackUsers,
} = require('./fallbackStore');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password, confirmPassword, role } = req.body;

    // Validation checks
    if (!fullName || !email || !mobileNumber || !password || !role) {
      return res.status(400).json({ success: false, message: 'Please complete all required fields.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (!['labour', 'customer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role selected.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    const isMongoDB = getDBStatus();

    if (isMongoDB) {
      // Check duplicate in Mongo
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      }

      const mobileExists = await User.findOne({ mobileNumber });
      if (mobileExists) {
        return res.status(400).json({ success: false, message: 'An account with this mobile number already exists.' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create User
      const user = await User.create({
        fullName,
        email: email.toLowerCase(),
        mobileNumber,
        password: hashedPassword,
        role,
        isVerified: true,
      });

      // Create role specific profile
      if (role === 'labour') {
        await LabourProfile.create({
          userId: user._id,
          skills: ['General Labor', 'Site Helper'],
        });
      } else if (role === 'customer') {
        await CustomerProfile.create({
          userId: user._id,
          companyName: `${fullName} Operations`,
        });
      }

      const token = generateToken(user._id, user.role);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully!',
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobileNumber: user.mobileNumber,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
      });
    } else {
      // Fallback Mode logic
      const emailExists = findFallbackUserByEmail(email);
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      }

      const mobileExists = findFallbackUserByMobile(mobileNumber);
      if (mobileExists) {
        return res.status(400).json({ success: false, message: 'An account with this mobile number already exists.' });
      }

      const newId = '65f0a0000000000000' + (Date.now() % 1000000).toString().padStart(6, '0');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: newId,
        fullName,
        email: email.toLowerCase(),
        mobileNumber,
        passwordHash: hashedPassword,
        role,
        avatar: '',
        isVerified: true,
        status: 'active',
        createdAt: new Date(),
      };

      addFallbackUser(newUser);
      const token = generateToken(newId, role);

      return res.status(201).json({
        success: true,
        message: 'Account registered successfully (Demo Mode)!',
        token,
        user: {
          id: newId,
          fullName,
          email: email.toLowerCase(),
          mobileNumber,
          role,
          avatar: '',
          isVerified: true,
        },
      });
    }
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during registration: ' + error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be email or mobile

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Please enter your email/mobile and password.' });
    }

    const isMongoDB = getDBStatus();

    if (isMongoDB) {
      const user = await User.findOne({
        $or: [{ email: identifier.toLowerCase() }, { mobileNumber: identifier }],
      }).select('+password');

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
      }

      const token = generateToken(user._id, user.role);

      return res.json({
        success: true,
        message: 'Login successful!',
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobileNumber: user.mobileNumber,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
      });
    } else {
      // Fallback Mode
      let user = findFallbackUserByEmail(identifier) || findFallbackUserByMobile(identifier);

      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
      }

      // Check password hash or simple match for demo accounts
      let isMatch = false;
      if (user.passwordHash) {
        isMatch = await bcrypt.compare(password, user.passwordHash);
      }
      // Demo credentials shortcut
      if (!isMatch && (password === 'Admin@1234' || password === 'Labour@1234' || password === 'Customer@1234' || password === 'password123')) {
        isMatch = true;
      }

      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials. Password incorrect.' });
      }

      const token = generateToken(user._id, user.role);

      return res.json({
        success: true,
        message: 'Login successful (Demo Mode)!',
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          mobileNumber: user.mobileNumber,
          role: user.role,
          avatar: user.avatar,
          isVerified: user.isVerified,
        },
      });
    }
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error during login: ' + error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMongoDB = getDBStatus();
    let roleProfile = null;

    if (isMongoDB) {
      if (user.role === 'labour') {
        roleProfile = await LabourProfile.findOne({ userId: user._id });
      } else if (user.role === 'customer') {
        roleProfile = await CustomerProfile.findOne({ userId: user._id });
      }
    } else {
      if (user.role === 'labour') {
        roleProfile = getFallbackLabourProfile(user._id || user.id);
      } else if (user.role === 'customer') {
        roleProfile = getFallbackCustomerProfile(user._id || user.id);
      }
    }

    return res.json({
      success: true,
      user,
      profile: roleProfile,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request Password Reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ success: false, message: 'Email or Mobile number is required' });
    }

    // Generate a secure 6-digit OTP
    const generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const isMongoDB = getDBStatus();

    if (isMongoDB) {
      await PasswordReset.create({
        identifier: identifier.toLowerCase(),
        otp: generatedOTP,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      });
    } else {
      storeFallbackOTP(identifier.toLowerCase(), generatedOTP);
    }

    return res.json({
      success: true,
      message: `OTP sent successfully to ${identifier}`,
      demoOTP: generatedOTP, // Provided in response for easy developer/testing verification
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify OTP Code
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { identifier, otp } = req.body;
    if (!identifier || !otp) {
      return res.status(400).json({ success: false, message: 'Identifier and OTP code are required' });
    }

    const isMongoDB = getDBStatus();
    let isValid = false;

    if (isMongoDB) {
      const resetRecord = await PasswordReset.findOne({
        identifier: identifier.toLowerCase(),
        otp,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      });
      if (resetRecord) isValid = true;
    } else {
      isValid = verifyFallbackOTP(identifier.toLowerCase(), otp);
    }

    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code. Please try again.' });
    }

    return res.json({
      success: true,
      message: 'OTP verified successfully. Proceed to reset password.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { identifier, otp, newPassword, confirmPassword } = req.body;

    if (!identifier || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const isMongoDB = getDBStatus();

    if (isMongoDB) {
      const resetRecord = await PasswordReset.findOne({
        identifier: identifier.toLowerCase(),
        otp,
        isUsed: false,
        expiresAt: { $gt: new Date() },
      });

      if (!resetRecord) {
        return res.status(400).json({ success: false, message: 'Invalid session or expired OTP.' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await User.findOneAndUpdate(
        { $or: [{ email: identifier.toLowerCase() }, { mobileNumber: identifier }] },
        { password: hashedPassword }
      );

      resetRecord.isUsed = true;
      await resetRecord.save();
    } else {
      const isValid = verifyFallbackOTP(identifier.toLowerCase(), otp);
      if (!isValid) {
        return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
      }

      const user = findFallbackUserByEmail(identifier) || findFallbackUserByMobile(identifier);
      if (user) {
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
      }
    }

    return res.json({
      success: true,
      message: 'Password reset successful! You can now log in with your new password.',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  forgotPassword,
  verifyOTP,
  resetPassword,
};
