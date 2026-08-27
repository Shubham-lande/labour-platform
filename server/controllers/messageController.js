const Message = require('../models/Message');
const { getDBStatus } = require('../config/db');
const { addFallbackMessage, getFallbackMessages } = require('./fallbackStore');

// @desc    Get Chat Thread Messages for a Project
// @route   GET /api/messages/:projectId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const messages = getFallbackMessages(projectId);
      return res.json({ success: true, count: messages.length, data: messages });
    }

    const messages = await Message.find({ project: projectId }).sort('createdAt');
    return res.json({ success: true, count: messages.length, data: messages });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Send Message in Project Chat Thread
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id || req.user.id;
    const { projectId, text, photoUrl, documentUrl, documentName, location } = req.body;

    if (!projectId || (!text && !photoUrl && !documentUrl && !location)) {
      return res.status(400).json({ success: false, message: 'Message must contain text, media, document, or location.' });
    }

    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const msg = addFallbackMessage({
        project: projectId,
        sender: senderId,
        senderName: req.user.fullName || 'User',
        senderRole: req.user.role || 'customer',
        text: text || '',
        photoUrl: photoUrl || '',
        documentUrl: documentUrl || '',
        documentName: documentName || '',
        location: location || { address: '', city: '' },
      });

      return res.status(201).json({ success: true, message: msg });
    }

    const msg = await Message.create({
      project: projectId,
      sender: senderId,
      senderName: req.user.fullName || 'User',
      senderRole: req.user.role || 'customer',
      text: text || '',
      photoUrl: photoUrl || '',
      documentUrl: documentUrl || '',
      documentName: documentName || '',
      location: location || { address: '', city: '' },
    });

    return res.status(201).json({ success: true, message: msg });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMessages,
  sendMessage,
};
