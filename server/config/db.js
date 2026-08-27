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
    console.log(`[Database Info]: Local MongoDB not detected (${error.message}). Running in Live Demo / Fallback Mode.`);
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
