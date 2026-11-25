// =====================================================================================
// src/app.js - builds the Express application: which middleware runs, in which ORDER, and which routes exist.
//
// CONCEPT: Express keeps an ordered list of middleware and runs it top to bottom for every request, so the
// order below is deliberate:
//   security -> parsing -> logging -> rate limit -> routes -> 404 -> error handler (always last)
// =====================================================================================
import express from "express";
import cors from "cors"; // lets the browser frontend (another origin) read our responses
import helmet from "helmet"; // sets protective HTTP headers
import morgan from "morgan"; // prints one log line per request
import rateLimit from "express-rate-limit"; // caps requests per client per time window
import swaggerUi from "swagger-ui-express"; // serves the interactive API documentation page
import employeeRoutes from "./routes/employee.routes.js";
import { swaggerSpec } from "./config/swagger.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import timer from "./middleware/timer.js";

const app = express(); // express() creates the application object

// app.use(fn) registers middleware that runs for EVERY request, in the order the lines appear.

// 1) helmet() adds security headers (for example X-Content-Type-Options, Content-Security-Policy) to every response.
app.use(helmet());

// 2) cors(options): browsers block a page from reading responses from a different ORIGIN (scheme + host + port).
//    `origin` = the one frontend origin we allow; `credentials: true` lets cookies be sent (Day 4 login).
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));

// 3) express.json(options): built-in body parser. Reads a JSON request body into req.body.
//    `limit` refuses bodies larger than 10 kilobytes (status 413), protecting memory.
app.use(express.json({ limit: "10kb" }));

// 4) morgan("dev"): third-party request logger, prints e.g. "GET /api/employees 200 3.2 ms".
app.use(morgan("dev"));

// 5) timer: our OWN middleware (see middleware/timer.js). It proves that middleware order matters.
app.use(timer);

// 6) rateLimit(options) counts requests per client IP.
//    windowMs: length of the window (15 * 60 * 1000 ms = 15 minutes); limit: max requests in a window.
//    Over the limit the client gets HTTP 429. standardHeaders adds the RateLimit-* headers;
//    legacyHeaders: false turns off the old X-RateLimit-* ones.
//    app.use("/api", ...) applies it only to URLs that start with /api.
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

// app.get(path, handler): a route. Health check: monitoring tools call this to see that the server is alive.
// process.uptime() = seconds since the process started.
app.get("/api/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

// swaggerUi.serve serves the Swagger page's static files; swaggerUi.setup(spec) renders the page from our
// description in config/swagger.js. Open http://localhost:5000/api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// app.use(path, router): mounts a router. Every route inside employee.routes.js now lives under /api/employees
// (for example router.get("/:id") becomes GET /api/employees/:id).
app.use("/api/employees", employeeRoutes);

// These two MUST come after all routes:
app.use(notFound); // no route matched -> create a 404 error and pass it on with next(error)
app.use(errorHandler); // turns every error into a JSON response (four-argument middleware)

export default app; // server.js imports and starts it
