const Invoice = require('../models/Invoice');
const { getDBStatus } = require('../config/db');
const { getFallbackInvoices, getFallbackInvoiceById } = require('./fallbackStore');

// @desc    Get List of Invoices
// @route   GET /api/invoices
// @access  Private
const getInvoices = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const invoices = getFallbackInvoices(userId);
      return res.json({ success: true, count: invoices.length, data: invoices });
    }

    let query = {};
    if (req.user.role === 'customer') query.customer = userId;
    if (req.user.role === 'labour') query.labour = userId;

    const invoices = await Invoice.find(query).sort('-createdAt');
    return res.json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Single Invoice Document
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const invoice = getFallbackInvoiceById(id);
      if (!invoice) return res.status(404).json({ success: false, message: 'Invoice document not found.' });
      return res.json({ success: true, data: invoice });
    }

    const invoice = await Invoice.findById(id)
      .populate('customer', 'fullName email mobileNumber')
      .populate('labour', 'fullName email mobileNumber');

    if (!invoice) return res.status(404).json({ success: false, message: 'Invoice document not found.' });
    return res.json({ success: true, data: invoice });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
};
