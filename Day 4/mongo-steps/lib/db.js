// Shared by every step: one place that connects to MongoDB.

// Import the default export of the mongoose package (the ODM: Object Data Mapper for MongoDB).
import mongoose from "mongoose";
// The connection string is written in lib/config.js (open it to see exactly what we connect to).
import { MONGO_URI } from "./config.js";

// `export` makes the function importable from other files. `async` lets us use `await` inside
// and makes the function return a Promise.
export async function connect() {
  // Open the connection and WAIT until it is ready (or throws if MongoDB is unreachable).
  await mongoose.connect(MONGO_URI);
  // Print which server (host) and which database (name) we are now talking to.
  console.log(`connected -> ${mongoose.connection.host}/${mongoose.connection.name}`);
}

// Arrow function that just returns the promise from mongoose.disconnect(). Closing the connection
// lets the Node process exit by itself when a script is finished (an open connection keeps it alive).
export const disconnect = () => mongoose.disconnect();
