const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const { getDBStatus } = require('../config/db');
const { addFallbackPayment, getFallbackPayments } = require('./fallbackStore');

// @desc    Process Mock/Gateway Payment & Auto-Generate Invoice
// @route   POST /api/payments
// @access  Private (Customer)
const createPayment = async (req, res) => {
  try {
    const customerId = req.user._id || req.user.id;
    const {
      projectId,
      bookingId,
      labourId,
      labourName,
      amount,
      paidAmount,
      paymentMethod, // 'upi_razorpay' | 'card_stripe' | 'bank_transfer' | 'escrow_wallet'
      workDescription,
      duration,
      dailyRate,
      additionalCharges,
    } = req.body;

    const numAmount = parseFloat(amount);
    const numPaid = parseFloat(paidAmount || amount);

    if (isNaN(numAmount) || numAmount < 0 || isNaN(numPaid) || numPaid < 0) {
      return res.status(400).json({ success: false, message: 'Monetary payment values must be non-negative numbers.' });
    }

    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const result = addFallbackPayment({
        project: projectId,
        booking: bookingId,
        customer: customerId,
        labour: labourId || '65f0a0000000000000000002',
        customerName: req.user.fullName || 'Apex Buildcon Ltd',
        labourName: labourName || 'Rajesh Kumar',
        amount: numAmount,
        paidAmount: numPaid,
        paymentMethod: paymentMethod || 'upi_razorpay',
        workDescription,
        duration,
        dailyRate,
        additionalCharges,
      });

      return res.status(201).json({
        success: true,
        message: 'Payment processed successfully! Invoice generated automatically.',
        payment: result.payment,
        invoice: result.invoice,
      });
    }

    const txnId = 'TXN-' + Math.random().toString(36).substring(2, 9).toUpperCase();
    const remainingAmount = Math.max(0, numAmount - numPaid);
    const status = numPaid >= numAmount ? 'paid' : numPaid > 0 ? 'partially_paid' : 'pending';

    const payment = await Payment.create({
      project: projectId,
      booking: bookingId,
      customer: customerId,
      labour: labourId,
      customerName: req.user.fullName || 'Customer Enterprise',
      labourName: labourName || 'Skilled Labour',
      amount: numAmount,
      paidAmount: numPaid,
      remainingAmount,
      paymentMethod: paymentMethod || 'upi_razorpay',
      status,
      transactionId: txnId,
      breakdown: {
        rate: dailyRate || 1200,
        duration: duration || '5 Days',
        additionalCharges: additionalCharges || 0,
      },
    });

    const invNum = 'INV-2026-' + Math.floor(1000 + Math.random() * 9000);
    const invoice = await Invoice.create({
      invoiceNumber: invNum,
      payment: payment._id,
      project: projectId,
      customer: customerId,
      labour: labourId,
      customerName: req.user.fullName || 'Customer Enterprise',
      labourName: labourName || 'Skilled Labour',
      workDescription: workDescription || 'Site Labour Services',
      duration: duration || '5 Days',
      dailyRate: dailyRate || 1200,
      additionalCharges: additionalCharges || 0,
      taxAmount: Math.round(numAmount * 0.18),
      totalAmount: numAmount,
      paymentStatus: status === 'paid' ? 'paid' : 'pending',
      transactionId: txnId,
      issueDate: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: 'Payment processed successfully! Invoice generated automatically.',
      payment,
      invoice,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Payment History
// @route   GET /api/payments
// @access  Private
const getPayments = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const isMongoDB = getDBStatus();

    if (!isMongoDB) {
      const records = getFallbackPayments(userId);
      return res.json({ success: true, count: records.length, data: records });
    }

    let query = {};
    if (req.user.role === 'customer') query.customer = userId;
    if (req.user.role === 'labour') query.labour = userId;

    const records = await Payment.find(query).sort('-createdAt');
    return res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPayment,
  getPayments,
};
