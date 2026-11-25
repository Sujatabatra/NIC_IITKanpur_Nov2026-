// =====================================================================================
// STEP 09 - app.js: ONLY wiring. Every piece lives in its own file (see the folder tree in server.js).
//
// Compare with ../10-security.js and ../../../../backend/src/app.js: this version has no security middleware
// yet, so you can see the pure layered structure first.
// =====================================================================================
import express from "express";
import employeeRoutes from "./routes/employee.routes.js"; // URL -> validation -> controller
import { notFound, errorHandler } from "./middleware/errorHandler.js"; // 404 + central error handling
import timer from "./middleware/timer.js"; // our logging middleware

const app = express();

app.use(express.json()); // body parser: fills req.body (must come before the routes)
app.use(timer); // logs "-> before handler" / "<- after response" for every request
app.get("/api/health", (req, res) => res.json({ status: "ok" })); // a route written directly in app.js

// Mount the router: its "/" becomes /api/employees, its "/:id" becomes /api/employees/:id
app.use("/api/employees", employeeRoutes);

app.use(notFound); // unknown URL -> ApiError(404)
app.use(errorHandler); // MUST be last: converts every error to JSON
export default app; // server.js imports it and calls listen
