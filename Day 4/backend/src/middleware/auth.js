import jwt from "jsonwebtoken"; // to verify tokens
import User from "../models/User.js"; // to load the user the token belongs to
import ApiError from "../utils/ApiError.js"; // errors with an HTTP status
import asyncHandler from "../utils/asyncHandler.js"; // forwards async errors to the error handler

// protect = authentication: "who are you?". Put it before any route that needs a logged-in user.
export const protect = asyncHandler(async (req, res, next) => {
  let token = req.cookies?.token; // 1) HttpOnly cookie (browser); ?. avoids a crash when cookies is undefined
  const header = req.headers.authorization; // e.g. "Bearer eyJhbGci..."
  if (!token && header?.startsWith("Bearer ")) token = header.split(" ")[1]; // 2) Bearer header (Postman, mobile): take the part after the space
  if (!token) throw new ApiError(401, "Not authenticated"); // no credentials at all -> 401

  const decoded = jwt.verify(token, process.env.JWT_SECRET); // throws -> errorHandler -> 401 (bad signature or expired)
  const user = await User.findById(decoded.id); // token is valid, but is the user still in the database?
  if (!user) throw new ApiError(401, "User no longer exists"); // deleted account -> token is useless
  req.user = user; // hand the user to the following middleware and the controller
  next(); // continue down the chain
});

// authorize = authorization: "may you do this?". Used as authorize("admin") or authorize("admin", "manager").
// (...roles) gathers the allowed roles; the returned function is the actual middleware.
export const authorize =
  (...roles) =>
  (req, res, next) =>
    // role allowed -> continue; otherwise pass a 403 Forbidden error along
    roles.includes(req.user.role) ? next() : next(new ApiError(403, "Forbidden: insufficient role"));
