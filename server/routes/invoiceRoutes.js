const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getInvoices, getInvoiceById } = require('../controllers/invoiceController');

router.get('/', protect, getInvoices);
router.get('/:id', protect, getInvoiceById);

module.exports = router;
