const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    console.log('[Database Info]: MONGODB_URI not set. Running in Live Demo / Fallback Mode.');
    isConnected = false;
    return;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`[MongoDB Connected]: Host -> ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.log(`[Database Info]: Could not connect to MongoDB Atlas (${error.message}). Running in Live Demo / Fallback Mode.`);
  }
};

const getDBStatus = () => isConnected || mongoose.connection.readyState >= 1;

module.exports = { connectDB, getDBStatus };
