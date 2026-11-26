import express from "express"; // web framework
import cors from "cors"; // lets the browser frontend (another origin) call this API
import helmet from "helmet"; // sets security-related HTTP headers
import morgan from "morgan"; // logs each request to the console
import cookieParser from "cookie-parser"; // reads cookies into req.cookies
import rateLimit from "express-rate-limit"; // throttles requests per client
import swaggerUi from "swagger-ui-express"; // serves the interactive API docs page
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import departmentRoutes from "./routes/department.routes.js";
import { swaggerSpec } from "./config/swagger.js"; // the API description (OpenAPI)
import { notFound, errorHandler } from "./middleware/errorHandler.js";

const app = express(); // create the application

app.use(helmet()); // security headers on every response
// credentials: true + a specific origin are required for cookies ("*" is not allowed with credentials)
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(express.json({ limit: "10kb" })); // parse JSON bodies; reject bodies over 10 KB
app.use(cookieParser()); // parse the Cookie header
if (process.env.NODE_ENV !== "test") app.use(morgan("dev")); // request log, except during tests

// 300 requests per 15 minutes per client on every /api route (auth routes add a stricter limiter of their own)
app.use("/api", rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

// simple health check: shows the server is up and for how many seconds
app.get("/api/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // Swagger UI at /api-docs
app.use("/api/auth", authRoutes); // mount each router under its URL prefix
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);

// These two MUST come last: first "no route matched" -> 404, then the central error handler.
app.use(notFound);
app.use(errorHandler);

export default app; // server.js starts it; tests could import it without opening a port
