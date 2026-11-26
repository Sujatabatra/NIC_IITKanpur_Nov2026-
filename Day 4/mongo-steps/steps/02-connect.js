// =====================================================================================
// STEP 02 - Connect to MongoDB with Mongoose, and fail fast when you cannot
// Run:  node steps/02-connect.js
//
// WHAT YOU LEARN
//   - mongoose.connect(uri) returns a promise: await it BEFORE you start serving requests
//   - the connection string (URI) is written in lib/config.js so you can see it (real projects keep it in .env)
//   - connection events and readyState
//   - what a wrong URI looks like (try it!)
// =====================================================================================

// The Mongoose library.
import mongoose from "mongoose";
// The connection string is written in lib/config.js. Open that file and read it: it is the address of the database.
import { MONGO_URI } from "../lib/config.js";

// Show the exact string we are about to use (training only: a real URI contains a password, so never log it in a real app).
console.log("connecting to:", MONGO_URI);
const uri = MONGO_URI;
// `!uri` is true when the string is empty.
if (!uri) {
  // console.error writes to the error stream (stderr), the right place for failures.
  console.error("MONGO_URI is empty in lib/config.js");
  process.exit(1); // exit code 1 = failure; a server that cannot reach its database must not start
}

// Events fire during the life of the connection (useful for logging / monitoring).
// .on(name, callback) registers a function that Mongoose calls every time that event happens.
mongoose.connection.on("connected", () => console.log("event: connected"));
mongoose.connection.on("disconnected", () => console.log("event: disconnected"));

// try/catch: if anything inside `try` throws (or an awaited promise rejects), control jumps to `catch`.
try {
  // serverSelectionTimeoutMS: give up after 5 s instead of the default 30 s when the server is unreachable
  const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  // conn.connection.host = machine we connected to; .name = the database name taken from the URI.
  console.log("host:", conn.connection.host, "| database:", conn.connection.name);
  // readyState: 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
  console.log("readyState:", mongoose.connection.readyState);
} catch (err) {
  // err.message explains what went wrong (wrong host, bad password, timeout ...).
  console.error("Could not connect:", err.message);
  process.exit(1); // stop with a failure code
}

// Close the connection; this triggers the "disconnected" event and lets Node exit.
await mongoose.disconnect();

// TRY IT: change the port in lib/config.js (MONGO_URI) to 27999 and run again: you get a clear error after 5 seconds.
// Atlas checklist if it fails: IP address allowed in Network Access, user + password correct, password URL-encoded.
