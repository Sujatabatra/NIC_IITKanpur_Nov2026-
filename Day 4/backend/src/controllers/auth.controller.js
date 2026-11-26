import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { signToken, cookieOptions, COOKIE_MAX_AGE } from "../utils/token.js";

// Shared reply for register and login: set the cookie, then answer with the user's safe details.
const sendAuth = (res, status, user) => {
  const token = signToken(user); // create the JWT
  res.cookie("token", token, { ...cookieOptions, maxAge: COOKIE_MAX_AGE }); // HttpOnly cookie holding the token
  res.status(status).json({
    success: true,
    token, // handy for Postman; browsers use the HttpOnly cookie
    data: { id: user._id, name: user.name, email: user.email, role: user.role }, // never the password
  });
};

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body; // read only these three fields
  if (await User.findOne({ email })) throw new ApiError(409, "Email already registered"); // friendly duplicate check
  // role is NOT taken from the body: prevents privilege escalation (mass assignment)
  const user = await User.create({ name, email, password }); // pre("save") hashes the password
  sendAuth(res, 201, user); // 201 Created
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password"); // password is hidden by default; ask for it here
  // same message for unknown email and wrong password
  if (!user || !(await user.matchPassword(password))) throw new ApiError(401, "Invalid email or password");
  sendAuth(res, 200, user);
});

// POST /api/auth/logout: remove the cookie (options must match the ones used to set it)
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token", cookieOptions);
  res.json({ success: true, message: "Logged out" });
});

// GET /api/auth/me: req.user was loaded by the protect middleware
export const me = asyncHandler(async (req, res) => {
  const u = req.user;
  res.json({ success: true, data: { id: u._id, name: u.name, email: u.email, role: u.role } });
});
