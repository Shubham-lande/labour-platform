const Complaint = require('../models/Complaint');
const { getDBStatus } = require('../config/db');
const { addFallbackComplaint, getFallbackComplaints, updateFallbackComplaintStatus } = require('./fallbackStore');

// @desc    Raise Complaint Form Submission
// @route   POST /api/complaints
// @access  Private
const raiseComplaint = async (req, res) => {
  try {
    const raisedBy = req.user._id || req.user.id;
    const {
      projectId,
      userInvolved,
      userInvolvedName,
      complaintType,
      description,
      evidenceUrl,
      amountInvolved,
    } = req.body;

    if (!complaintType || !description) {
      return res.status(400).json({ success: false, message: 'Complaint category type and description are required.' });
    }

    const numAmount = parseFloat(amountInvolved || 0);
    if (isNaN(numAmount) || numAmount < 0) {
      return res.status(400).json({ success: false, message: 'Amount involved must be a non-negative number.' });
    }

    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const cmp = addFallbackComplaint({
        raisedBy,
        userInvolved,
        raisedByName: req.user.fullName || 'Enterprise User',
        userInvolvedName: userInvolvedName || 'Workforce User',
        project: projectId,
        complaintType,
        description,
        evidenceUrl: evidenceUrl || '',
        amountInvolved: numAmount,
      });

      return res.status(201).json({
        success: true,
        message: 'Complaint submitted successfully! Dispute Resolution desk will investigate.',
        complaint: cmp,
      });
    }

    const cmp = await Complaint.create({
      raisedBy,
      userInvolved,
      raisedByName: req.user.fullName || 'Enterprise User',
      userInvolvedName: userInvolvedName || 'Workforce User',
      project: projectId,
      complaintType,
      description,
      evidenceUrl: evidenceUrl || '',
      amountInvolved: numAmount,
      status: 'submitted',
    });

    return res.status(201).json({
      success: true,
      message: 'Complaint submitted successfully! Dispute Resolution desk will investigate.',
      complaint: cmp,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get List of Complaints for User
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const list = getFallbackComplaints(userId);
      return res.json({ success: true, count: list.length, data: list });
    }

    let query = {};
    if (req.user.role !== 'admin') {
      query = { $or: [{ raisedBy: userId }, { userInvolved: userId }] };
    }

    const list = await Complaint.find(query).sort('-createdAt');
    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Complaint Status
// @route   PUT /api/complaints/:id/status
// @access  Private (Admin / Support)
const updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNotes } = req.body;

    const allowed = ['submitted', 'under_review', 'investigating', 'resolved', 'rejected', 'closed'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid complaint status value.' });
    }

    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const cmp = updateFallbackComplaintStatus(id, status, resolutionNotes);
      if (!cmp) return res.status(404).json({ success: false, message: 'Complaint record not found.' });
      return res.json({ success: true, message: `Complaint status updated to ${status.toUpperCase()}`, complaint: cmp });
    }

    const cmp = await Complaint.findByIdAndUpdate(
      id,
      { status, resolutionNotes: resolutionNotes || '' },
      { new: true }
    );

    if (!cmp) return res.status(404).json({ success: false, message: 'Complaint record not found.' });
    return res.json({ success: true, message: `Complaint status updated to ${status.toUpperCase()}`, complaint: cmp });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  raiseComplaint,
  getComplaints,
  updateComplaintStatus,
};
