import "dotenv/config"; // load .env into process.env before anything else reads it
import app from "./src/app.js"; // the configured Express app
import connectDB from "./src/config/db.js"; // MongoDB connection function

const PORT = process.env.PORT || 5000; // port from .env, default 5000

try {
  await connectDB(); // connect first, then accept traffic
  // start listening for HTTP requests; the callback prints the address once the port is open
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
} catch (err) {
  // database unreachable or misconfigured: print why and exit with failure instead of running half-broken
  console.error("Startup failed:", err.message);
  process.exit(1);
}
