// =====================================================================================
// STEP 10 - Authentication (who are you?) and authorization (what may you do?)
// Run:  node steps/10-auth-api.js        Test with requests.http (section 10)
//
// WHAT YOU LEARN
//   - register / login / logout / me, with the JWT stored in an HttpOnly cookie
//   - protect middleware: reads the cookie (or a Bearer header), verifies the token, loads req.user
//   - authorize("admin") middleware: allows only some roles
//   - 401 = "I do not know who you are"    403 = "I know who you are, and you may not do this"
//   - mass assignment: register IGNORES any `role` sent by the client
//   - an admin cannot be created through the API: step 11 seeds one
// =====================================================================================

import express from "express"; // web framework
import cookieParser from "cookie-parser"; // middleware that reads the Cookie header into req.cookies
import jwt from "jsonwebtoken"; // sign / verify tokens
import { connect } from "../lib/db.js"; // DB connection helper
import { Employee, User } from "../lib/models.js"; // shared models
import { PORT, JWT_SECRET, JWT_EXPIRES_IN } from "../lib/config.js"; // settings written in lib/config.js

const app = express(); // create the app
app.use(express.json()); // parse JSON bodies into req.body
app.use(cookieParser()); // fills req.cookies

// A custom Error that also carries an HTTP status code, so handlers can `throw new ApiError(401, "...")`.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message); // set the normal Error message
    this.statusCode = statusCode; // remember the HTTP status for the error handler
  }
}

// ---------------------------------- helpers ----------------------------------
// Create a signed token containing the user's id and role; it expires after JWT_EXPIRES_IN (default 1 day).
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// Settings for the cookie that carries the token.
const cookieOptions = {
  httpOnly: true, // JavaScript in the page cannot read it, so XSS cannot steal it
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax", // not sent on cross-site POSTs: basic CSRF protection
  path: "/", // the cookie is sent for every URL of this site
};

// Shared reply for register and login: set the cookie, then send the (safe) user details.
function sendAuth(res, status, user) {
  // maxAge is in milliseconds: 24h * 60min * 60s * 1000ms
  res.cookie("token", signToken(user), { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });
  res.status(status).json({
    success: true,
    // send only safe fields: NEVER the password or its hash
    data: { id: user._id, name: user.name, email: user.email, role: user.role },
  });
}

// ---------------------------------- middleware ----------------------------------
// protect = authentication. Runs BEFORE the route handler and either stops the request or sets req.user.
const protect = async (req, res, next) => {
  let token = req.cookies?.token; // browser (?. avoids an error if req.cookies is undefined)
  const header = req.headers.authorization; // e.g. "Bearer eyJ..."
  if (!token && header?.startsWith("Bearer ")) token = header.split(" ")[1]; // Postman / mobile app
  if (!token) throw new ApiError(401, "Not authenticated"); // no token at all -> 401

  const decoded = jwt.verify(token, JWT_SECRET); // throws when bad -> error handler -> 401
  const user = await User.findById(decoded.id); // the user might have been deleted since the token was issued
  if (!user) throw new ApiError(401, "User no longer exists");
  req.user = user; // make the user available to the next handlers
  next(); // continue to the next middleware / route handler
};

// authorize = authorization. It returns a middleware, so it is used as authorize("admin").
// ...roles collects all arguments into an array; the inner function is the real middleware.
const authorize = (...roles) => (req, res, next) =>
  // allowed role -> next(); otherwise pass a 403 error to the error handler
  roles.includes(req.user.role) ? next() : next(new ApiError(403, "Forbidden: insufficient role"));

// ---------------------------------- auth routes ----------------------------------
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body; // take ONLY these three fields
  if (await User.findOne({ email })) throw new ApiError(409, "Email already registered"); // duplicate -> 409
  // role is deliberately NOT read from the body. Otherwise anyone could register as "admin".
  const user = await User.create({ name, email, password }); // pre("save") hashes the password
  sendAuth(res, 201, user); // 201 Created + cookie
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password"); // password is select:false, so ask for it explicitly
  // ONE message for "no such email" and "wrong password": do not tell an attacker which emails exist.
  if (!user || !(await user.matchPassword(password))) throw new ApiError(401, "Invalid email or password");
  sendAuth(res, 200, user);
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token", cookieOptions); // tell the browser to delete the cookie (options must match those used to set it)
  res.json({ success: true, message: "Logged out" });
});

// protect runs first; the handler only runs for logged-in users.
app.get("/api/auth/me", protect, (req, res) => {
  const u = req.user; // set by protect
  res.json({ success: true, data: { id: u._id, name: u.name, email: u.email, role: u.role } });
});

// ---------------------------------- protected resource ----------------------------------
// Everyone logged in may READ; only admins may WRITE.
app.get("/api/employees", protect, async (req, res) => {
  res.json({ success: true, data: await Employee.find().populate("department", "name") });
});
// Two middlewares in order: must be logged in (protect), then must be an admin (authorize).
app.post("/api/employees", protect, authorize("admin"), async (req, res) => {
  res.status(201).json({ success: true, data: await Employee.create(req.body) });
});
app.delete("/api/employees/:id", protect, authorize("admin"), async (req, res) => {
  const emp = await Employee.findByIdAndDelete(req.params.id);
  if (!emp) throw new ApiError(404, "Employee not found");
  res.status(204).end(); // success, no body
});

// ---------------------------------- errors ----------------------------------
// Central error handler (4 parameters). Every thrown error and every next(err) ends up here.
app.use((err, req, res, next) => {
  let status = err.statusCode || 500;
  let message = err.message;
  // Each branch uses array destructuring to assign status and message in one line.
  if (err.name === "ValidationError") [status, message] = [400, Object.values(err.errors).map((e) => e.message).join(", ")];
  else if (err.name === "CastError") [status, message] = [400, `Invalid ${err.path}`]; // malformed ObjectId
  else if (err.code === 11000) [status, message] = [409, "Duplicate value"]; // unique index violated
  else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") [status, message] = [401, "Invalid or expired token"];
  if (status === 500) console.error(err); // unexpected: log it
  res.status(status).json({ success: false, message });
});

await connect(); // connect to MongoDB first
app.listen(PORT, () => console.log(`step 10 running on http://localhost:${PORT}`)); // then accept requests

// TRY IT (requests.http, section 10), in this order:
//   1. GET /api/employees without logging in            -> 401
//   2. register a user, then GET /api/employees         -> 200 (cookie sent automatically by the REST Client)
//   3. POST /api/employees as that user                 -> 403
//   4. register with { "role": "admin" } in the body    -> the new user is still "user"
//   5. run step 11 to create a real admin, log in as admin, POST /api/employees -> 201
//   6. POST /api/auth/logout, then GET /api/auth/me     -> 401
