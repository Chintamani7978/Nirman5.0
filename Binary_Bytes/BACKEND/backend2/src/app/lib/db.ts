import mongoose, { Mongoose } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI environment variable is missing");
}


declare global {
  var mongooseCache: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}


const cached = global.mongooseCache || { conn: null, promise: null };
global.mongooseCache = cached;

export async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err: any) {
    cached.promise = null;
    console.error('MongoDB connection error:', err);
    throw new Error(`Database connection failed: ${err?.message || 'Unknown error'}`);
  }

  return cached.conn;
}

export default dbConnect;
