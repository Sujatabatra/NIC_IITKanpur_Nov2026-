// =====================================================================================
// STEP 10 - Security and production middleware
// Run:  node steps/10-security.js
//
// WHAT YOU LEARN
//   - helmet       : sets protective HTTP response headers
//   - cors         : decides which BROWSER origins may call the API (the React/Next app on port 3000)
//   - morgan       : request logging, replaces our hand-made logger from step 04
//   - rate limiting: slows down abuse and brute force attempts
//   - body size limit: refuse huge JSON bodies
// The finished API with Swagger docs is ../backend (day3/backend); this file shows only the wiring.
//
// CONCEPT: these are all MIDDLEWARE (step 04). Each one adds a protection before your routes run, which is
// why they are registered at the top of the file.
// =====================================================================================
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

const app = express();

// helmet() adds headers such as X-Content-Type-Options and Content-Security-Policy that tell browsers to
// behave more safely (for example, not to guess file types). Look at the response headers in the browser tools.
app.use(helmet());

// cors(options): a BROWSER blocks a page from reading responses from a different ORIGIN (scheme + host + port).
// The Next.js page (localhost:3000) and this API (localhost:5000) are different origins, so the API must
// say which origin it allows. `origin` is that allowed origin; `credentials: true` also allows cookies (Day 4).
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
// Without CORS, fetch("http://localhost:5000/...") from a page on http://localhost:3000 is blocked by the browser.
// (Postman and curl are not browsers, so CORS never affects them.)

// express.json({ limit }) refuses bodies bigger than the limit with status 413 Payload Too Large,
// so nobody can send a gigantic JSON document to exhaust memory.
app.use(express.json({ limit: "10kb" }));

// morgan(format): logs one line per request. "dev" format looks like: GET /api/health 200 3.2 ms
app.use(morgan("dev"));

// rateLimit(options): counts requests per client (by IP address). Over the limit -> HTTP 429 Too Many Requests.
//   windowMs: length of the counting window in ms (60 * 1000 = one minute)
//   limit: allowed requests per window per client
//   standardHeaders: send the modern RateLimit-* headers so clients can see how many requests are left
//   legacyHeaders: false = do not send the old X-RateLimit-* headers
// app.use("/api", ...) applies it only to URLs that start with /api.
// A very small limit so you can trigger it by refreshing 6 times. The real API uses 300 per 15 minutes.
app.use("/api", rateLimit({ windowMs: 60 * 1000, limit: 5, standardHeaders: true, legacyHeaders: false }));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(5000, () => console.log("http://localhost:5000/api/health  (refresh 6 times to see HTTP 429)"));

// ORDER of the real app (see ../backend/src/app.js):
//   helmet -> cors -> json parser -> logger -> rate limit -> routes -> notFound -> errorHandler
