// Mongoose: the library that talks to MongoDB.
import mongoose from "mongoose";

// Default export = the one function this file offers. `async` so we can `await` inside it.
export default async function connectDB() {
  // Fail fast with a clear message if the connection string was never configured in .env.
  if (!process.env.MONGO_URI) throw new Error("MONGO_URI is not set");
  // Open the connection and wait for it; throws if MongoDB is unreachable or credentials are wrong.
  const conn = await mongoose.connect(process.env.MONGO_URI);
  // Log which server and database we are connected to (never log the URI itself: it has the password).
  console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
}
