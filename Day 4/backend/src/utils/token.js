// jsonwebtoken: creates and checks JWTs.
import jwt from "jsonwebtoken";

// Create a signed token for a user. Payload (claims) = id and role; signed with the secret from .env.
// expiresIn: lifetime from .env (e.g. "1d"), defaulting to one day.
export const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

// Settings for the cookie that carries the token.
export const cookieOptions = {
  httpOnly: true, // not accessible from JavaScript
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "lax", // not sent on cross-site POSTs (basic CSRF protection), but sent when navigating to the site
  path: "/", // sent for every URL of the site
};

// Cookie lifetime in milliseconds: 24 hours * 60 minutes * 60 seconds * 1000 ms. Should match the token's expiry.
export const COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 1 day
