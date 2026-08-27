const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getDBStatus } = require('../config/db');
const { getFallbackUserById } = require('../controllers/fallbackStore');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_enterprise_jwt_key_2026_labour_platform_app'
      );

      if (getDBStatus()) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        req.user = getFallbackUserById(decoded.id);
      }

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User profile not found or deactivated' });
      }

      return next();
    } catch (error) {
      console.error('JWT Authorization error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed or expired' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no session token provided' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: User role '${req.user.role}' is not authorized to access this resource`,
      });
    }

    next();
  };
};

module.exports = { protect, authorize };
