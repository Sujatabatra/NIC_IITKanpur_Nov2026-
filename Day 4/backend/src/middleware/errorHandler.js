import ApiError from "../utils/ApiError.js"; // error type with a status code

// Runs when NO route matched. Creates a 404 error and passes it to the error handler below.
export const notFound = (req, res, next) =>
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));

// The central error handler. Express recognises it by its FOUR parameters (err first).
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500; // our ApiError carries a status; anything else is a 500 server error
  let message = err.message; // text shown to the client
  let errors = err.errors; // optional list of field errors

  if (err.name === "ValidationError") {
    // Mongoose schema validation
    statusCode = 400;
    message = "Validation failed";
    // convert Mongoose's error object into [{ field, message }, ...]
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === "CastError") {
    // bad ObjectId etc.
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    // duplicate key (unique index)
    statusCode = 409;
    message = `${Object.keys(err.keyValue || {})[0]} already exists`; // name of the duplicated field
  } else if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    // thrown by jwt.verify for tampered or expired tokens
    statusCode = 401;
    message = "Invalid or expired token";
  }

  res.status(statusCode).json({
    success: false,
    // in production hide internal details of unexpected 500 errors
    message: statusCode === 500 && process.env.NODE_ENV === "production" ? "Internal server error" : message,
    ...(errors && { errors }), // include `errors` only when it exists
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }), // stack trace only while developing
  });
};
