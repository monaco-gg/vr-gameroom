import mongoose, { Connection, ConnectOptions } from "mongoose";

declare global {
  // Declare a global cache type
  var mongooseCache: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

// Check if the MONGODB_URI environment variable is defined
const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

// Create a global cache for the MongoDB connection to avoid multiple connections
let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

/**
 * Connects to the MongoDB database using Mongoose.
 * Uses a cache to store the connection and ensure that the same connection
 * is reused in subsequent calls.
 *
 * @returns The MongoDB connection
 */
async function dbConnect(): Promise<Connection> {
  // If there is already a connection, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If there is no ongoing connection promise, create a new one
  if (!cached.promise) {
    const opts: ConnectOptions = {
      bufferCommands: false,
      // Set up connection pool options
      maxPoolSize: 10, // Adjust pool size according to your needs
      minPoolSize: 2, // Minimum number of connections in the pool
      serverSelectionTimeoutMS: 5000, // Timeout for selecting a server
      socketTimeoutMS: 45000, // Timeout for socket inactivity
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose.connection;
      })
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  // Wait for the connection promise to resolve
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
