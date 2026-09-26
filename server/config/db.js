const mongoose = require('mongoose');

/**
 * Global cache across Serverless Lambda invocations & local dev
 */
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, lastAttempt: 0 };
}

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    cached.conn = mongoose.connection;
    return cached.conn;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    return null;
  }

  // Throttle reconnection attempts to at most once per 60 seconds if offline
  const now = Date.now();
  if (cached.lastAttempt && now - cached.lastAttempt < 60000 && !cached.promise) {
    return null;
  }

  if (!cached.promise) {
    cached.lastAttempt = now;
    const opts = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 3000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(mongoURI, opts)
      .then((mongooseInstance) => {
        console.log(`[MongoDB Connected]: Host -> ${mongooseInstance.connection.host} | DB -> ${mongooseInstance.connection.name}`);
        cached.conn = mongooseInstance.connection;
        return mongooseInstance.connection;
      })
      .catch((err) => {
        cached.promise = null;
        console.warn(`[Database Info]: MongoDB connection not active (${err.message}). Seamlessly running on Embedded Persistent Store.`);
        return null;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
  }

  return cached.conn;
};

const getDBStatus = () => mongoose.connection.readyState === 1;

module.exports = { connectDB, getDBStatus };

