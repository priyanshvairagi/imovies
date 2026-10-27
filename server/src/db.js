import mongoose from 'mongoose';

/**
 * Mongoose connection ready states map
 */
export const ConnectionStates = {
  0: 'disconnected',
  1: 'connected',
  2: 'connecting',
  3: 'disconnecting',
};

/**
 * Checks whether MongoDB is currently connected.
 * @returns {boolean}
 */
export const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Retrieves the current database status details safely without credentials.
 * @returns {{ state: string, readyState: number, host: string | null, name: string | null }}
 */
export const getDatabaseStatus = () => {
  const readyState = mongoose.connection.readyState;
  return {
    state: ConnectionStates[readyState] || 'unknown',
    readyState,
    host: readyState === 1 ? mongoose.connection.host : null,
    name: readyState === 1 ? mongoose.connection.name : null,
  };
};

import dns from 'dns';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Keep system default if restricted
}

/**
 * Establishes connection to MongoDB database using Mongoose.
 * Uses process.env.MONGODB_URI without any hardcoded credentials.
 * Gracefully attempts local MongoDB fallback if Atlas is temporarily unreachable.
 */
export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGODB_URI is not set in environment variables');
  }

  try {
    const conn = await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 4000 });
    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ Primary MongoDB connection failed (${error.message}). Trying local MongoDB fallback...`);
    try {
      const localURI = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';
      const localConn = await mongoose.connect(localURI, { serverSelectionTimeoutMS: 3000 });
      console.log(`✅ Connected to local MongoDB: ${localConn.connection.host}`);
      return localConn;
    } catch (localErr) {
      console.error(`❌ MongoDB connection error: ${error.message}`);
      throw error;
    }
  }
};

/**
 * Disconnects from MongoDB gracefully.
 */
export const disconnectDB = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log('🛑 MongoDB connection closed');
  }
};

// Listen to connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected');
});

export default connectDB;
