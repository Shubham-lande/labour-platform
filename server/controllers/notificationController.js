const Notification = require('../models/Notification');
const { getDBStatus } = require('../config/db');
const { getFallbackNotifications, markFallbackNotificationsRead } = require('./fallbackStore');

// @desc    Get Notifications for Current User
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const list = getFallbackNotifications(userId);
      const unreadCount = list.filter((n) => !n.isRead).length;
      return res.json({ success: true, count: list.length, unreadCount, data: list });
    }

    const list = await Notification.find({ user: userId }).sort('-createdAt');
    const unreadCount = await Notification.countDocuments({ user: userId, isRead: false });

    return res.json({ success: true, count: list.length, unreadCount, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark All User Notifications as Read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      markFallbackNotificationsRead(userId);
      return res.json({ success: true, message: 'All notifications marked as read.' });
    }

    await Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
    return res.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  markAllAsRead,
};
