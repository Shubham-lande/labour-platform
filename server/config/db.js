const mongoose = require('mongoose');

/**
 * Global cache across Serverless Lambda invocations
 */
let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    cached.conn = mongoose.connection;
    return cached.conn;
  }

  const mongoURI = process.env.MONGODB_URI;
  if (!mongoURI) {
    return null;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(mongoURI, opts)
      .then((mongooseInstance) => {
        console.log(`[MongoDB Connected]: Host -> ${mongooseInstance.connection.host} | DB -> ${mongooseInstance.connection.name}`);
        return mongooseInstance.connection;
      })
      .catch((err) => {
        cached.promise = null;
        console.warn(`[Database Warning]: MongoDB connection failed (${err.message}). Using Persistent Store.`);
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

const getDBStatus = () => mongoose.connection.readyState >= 1;

module.exports = { connectDB, getDBStatus };
