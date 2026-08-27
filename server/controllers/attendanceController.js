const Attendance = require('../models/Attendance');
const { getDBStatus } = require('../config/db');
const { addFallbackAttendance, getFallbackAttendance } = require('./fallbackStore');

// Helper to calculate hours difference
const calculateHours = (startTimeStr, endTimeStr, breakMins = 30) => {
  try {
    const parseTime = (tStr) => {
      const [time, modifier] = tStr.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    const startMins = parseTime(startTimeStr);
    const endMins = parseTime(endTimeStr);
    let diff = endMins - startMins;
    if (diff < 0) diff += 24 * 60; // Overnight shift support
    const totalMinutes = Math.max(0, diff - breakMins);
    return Math.round((totalMinutes / 60) * 100) / 100;
  } catch (e) {
    return 8.0;
  }
};

// @desc    Record Check-In or Check-Out Attendance
// @route   POST /api/attendance
// @access  Private (Labour / Admin)
const recordAttendance = async (req, res) => {
  try {
    const workerId = req.user._id || req.user.id;
    const { projectId, action, date, startTime, endTime, breakMinutes, siteLocation } = req.body;

    if (!projectId || !action) {
      return res.status(400).json({ success: false, message: 'Project ID and action (check_in / check_out) are required.' });
    }

    const currentDate = date || new Date().toISOString().split('T')[0];
    const isMongoDB = getDBStatus();

    if (action === 'check_in') {
      const timeIn = startTime || '08:30 AM';
      if (!isMongoDB) {
        const att = addFallbackAttendance({
          worker: workerId,
          workerName: req.user.fullName || 'Rajesh Kumar',
          project: projectId,
          projectName: 'Smart Building Automation & High-Voltage Panel Wiring',
          date: currentDate,
          startTime: timeIn,
          endTime: null,
          breakMinutes: breakMinutes || 30,
          totalHours: 0,
          status: 'checked_in',
          siteLocation: siteLocation || 'Mumbai Site 4B',
        });

        return res.status(201).json({
          success: true,
          message: `Attendance Check-In logged at ${timeIn}!`,
          attendance: att,
        });
      }

      const att = await Attendance.create({
        worker: workerId,
        project: projectId,
        date: currentDate,
        startTime: timeIn,
        endTime: null,
        breakMinutes: breakMinutes || 30,
        totalHours: 0,
        status: 'checked_in',
        siteLocation: siteLocation || 'Mumbai Construction Site',
      });

      return res.status(201).json({
        success: true,
        message: `Attendance Check-In logged at ${timeIn}!`,
        attendance: att,
      });
    }

    if (action === 'check_out') {
      const timeOut = endTime || '05:30 PM';
      if (!isMongoDB) {
        const existingList = getFallbackAttendance(workerId, projectId);
        const openRecord = existingList.find((a) => a.status === 'checked_in');

        const startTimeStr = openRecord ? openRecord.startTime : '08:30 AM';
        const calcHrs = calculateHours(startTimeStr, timeOut, breakMinutes || 30);

        if (openRecord) {
          openRecord.endTime = timeOut;
          openRecord.breakMinutes = breakMinutes || 30;
          openRecord.totalHours = calcHrs;
          openRecord.status = 'checked_out';
          return res.json({
            success: true,
            message: `Attendance Check-Out logged at ${timeOut}! Total Working Hours: ${calcHrs} hrs.`,
            attendance: openRecord,
          });
        }

        const newAtt = addFallbackAttendance({
          worker: workerId,
          workerName: req.user.fullName || 'Rajesh Kumar',
          project: projectId,
          projectName: 'Smart Building Automation & High-Voltage Panel Wiring',
          date: currentDate,
          startTime: '08:30 AM',
          endTime: timeOut,
          breakMinutes: breakMinutes || 30,
          totalHours: calcHrs,
          status: 'checked_out',
          siteLocation: siteLocation || 'Mumbai Site 4B',
        });

        return res.json({
          success: true,
          message: `Attendance Check-Out logged at ${timeOut}! Total Working Hours: ${calcHrs} hrs.`,
          attendance: newAtt,
        });
      }

      let attRecord = await Attendance.findOne({
        worker: workerId,
        project: projectId,
        status: 'checked_in',
      });

      const startTimeStr = attRecord ? attRecord.startTime : '08:30 AM';
      const calcHrs = calculateHours(startTimeStr, timeOut, breakMinutes || 30);

      if (!attRecord) {
        attRecord = await Attendance.create({
          worker: workerId,
          project: projectId,
          date: currentDate,
          startTime: startTimeStr,
          endTime: timeOut,
          breakMinutes: breakMinutes || 30,
          totalHours: calcHrs,
          status: 'checked_out',
          siteLocation: siteLocation || 'Mumbai Construction Site',
        });
      } else {
        attRecord.endTime = timeOut;
        attRecord.breakMinutes = breakMinutes || 30;
        attRecord.totalHours = calcHrs;
        attRecord.status = 'checked_out';
        await attRecord.save();
      }

      return res.json({
        success: true,
        message: `Attendance Check-Out logged at ${timeOut}! Total Working Hours: ${calcHrs} hrs.`,
        attendance: attRecord,
      });
    }

    return res.status(400).json({ success: false, message: 'Invalid action parameter' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Attendance History Table Data
// @route   GET /api/attendance
// @access  Private
const getAttendanceHistory = async (req, res) => {
  try {
    const { projectId, workerId } = req.query;
    const currentUserId = req.user._id || req.user.id;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const records = getFallbackAttendance(workerId || (req.user.role === 'labour' ? currentUserId : null), projectId);
      return res.json({ success: true, count: records.length, data: records });
    }

    let query = {};
    if (projectId) query.project = projectId;
    if (workerId) query.worker = workerId;
    if (req.user.role === 'labour') query.worker = currentUserId;

    const records = await Attendance.find(query)
      .populate('worker', 'fullName email avatar')
      .populate('project', 'name category')
      .sort('-createdAt');

    return res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  recordAttendance,
  getAttendanceHistory,
};
