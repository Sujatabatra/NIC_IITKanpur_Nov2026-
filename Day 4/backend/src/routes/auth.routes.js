import { Router } from "express"; // Router = a mini app that holds routes for one resource
import { body } from "express-validator"; // validation rules for the request body
import rateLimit from "express-rate-limit"; // limits how many requests one client may make
import validate from "../middleware/validate.js"; // turns rule failures into a 400
import { protect } from "../middleware/auth.js"; // requires a logged-in user
import { register, login, logout, me } from "../controllers/auth.controller.js";

const router = Router(); // routes below are relative to /api/auth (mounted in app.js)

// stricter limit against brute-force login attempts
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // time window: 15 minutes
  limit: 30, // max requests per client in that window
  standardHeaders: true, // send the standard RateLimit-* headers
  legacyHeaders: false, // do not send the old X-RateLimit-* headers
  message: { success: false, message: "Too many attempts, try again later" }, // body of the 429 reply
});

// Reusable rule: password must be text of at least 8 characters.
const passwordRule = body("password").isString().isLength({ min: 8 }).withMessage("password must be at least 8 characters");

// Order matters: limiter -> rules -> validate -> controller.
router.post(
  "/register",
  authLimiter,
  // name required; email must be an email (and is normalised, e.g. lower-cased); password rule from above
  [body("name").trim().notEmpty().withMessage("name is required"), body("email").trim().isEmail().normalizeEmail(), passwordRule],
  validate,
  register
);
router.post(
  "/login",
  authLimiter,
  [body("email").trim().isEmail().normalizeEmail(), body("password").isString().notEmpty()], // only check presence on login
  validate,
  login
);
router.post("/logout", logout); // no checks needed: clearing a cookie is harmless
router.get("/me", protect, me); // must be logged in

export default router; // app.js mounts it at /api/auth
