const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getDBStatus } = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();

const app = express();

// Connect DB Middleware for Serverless Functions & Long-running Servers
app.use(async (req, res, next) => {
  if (process.env.MONGODB_URI) {
    await connectDB();
  }
  next();
});

// Initial DB connection attempt
connectDB();

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const mountApiRoutes = (prefix = '') => {
  app.get(`${prefix}/health`, (req, res) => {
    const isMongoConnected = getDBStatus();
    res.json({
      status: 'online',
      timestamp: new Date().toISOString(),
      service: 'Labour Management & Workforce Booking API',
      database: isMongoConnected ? 'MongoDB Connected' : 'Persistent Storage Active',
      isMongoDB: isMongoConnected,
      environment: process.env.NODE_ENV || 'production',
    });
  });

  app.use(`${prefix}/auth`, require('./routes/authRoutes'));
  app.use(`${prefix}/labour`, require('./routes/labourRoutes'));
  app.use(`${prefix}/customer`, require('./routes/customerRoutes'));
  app.use(`${prefix}/admin`, require('./routes/adminRoutes'));
  app.use(`${prefix}/bookings`, require('./routes/bookingRoutes'));
  app.use(`${prefix}/categories`, require('./routes/categoryRoutes'));
  app.use(`${prefix}/skills`, require('./routes/skillRoutes'));
  app.use(`${prefix}/projects`, require('./routes/projectRoutes'));
  app.use(`${prefix}/attendance`, require('./routes/attendanceRoutes'));

  // Phase 4 Routes
  app.use(`${prefix}/payments`, require('./routes/paymentRoutes'));
  app.use(`${prefix}/invoices`, require('./routes/invoiceRoutes'));
  app.use(`${prefix}/reviews`, require('./routes/reviewRoutes'));
  app.use(`${prefix}/messages`, require('./routes/messageRoutes'));
  app.use(`${prefix}/notifications`, require('./routes/notificationRoutes'));
  app.use(`${prefix}/complaints`, require('./routes/complaintRoutes'));
};

mountApiRoutes('/api');
mountApiRoutes('');

// 404 Fallback
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[Express Backend Running]: http://localhost:${PORT}`);
  });
}

module.exports = app;
