const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    isConnected = true;
    console.log(`[MongoDB Connected]: Host -> ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.warn(`[MongoDB Warning]: Could not connect to MongoDB (${error.message}).`);
    console.warn(`[Fallback Mode]: Server will utilize fallback storage for live API demonstration.`);
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
