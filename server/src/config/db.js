let isConnected = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[Database] MONGODB_URI is not set. Operating in in-memory development mode.');
    return null;
  }

  if (isConnected) {
    return isConnected;
  }

  try {
    const mongoose = (await import('mongoose')).default;
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      autoIndex: true,
    });
    isConnected = conn.connection;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn.connection;
  } catch (err) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${err.message}`);
    console.warn('[Database] Falling back to in-memory store for current session.');
    return null;
  }
}

export function isDbConnected() {
  return !!isConnected;
}

export default connectDB;
