// =====================================================================================
// middleware/errorHandler.js - ONE place that turns every error into a JSON response.
// Both functions are registered LAST in app.js (after all routes).
//
// CONCEPT: in Express, next(error) (or a throw inside a route) means "something went wrong". Express then
// skips all normal middleware and calls the first ERROR-HANDLING middleware that follows.
// =====================================================================================
import ApiError from "../utils/ApiError.js";

// notFound: runs only when no route matched. It does not answer itself: it creates a 404 error and passes it on
// with next(error), so the errorHandler below formats it like every other error.
// req.method = GET/POST ...; req.originalUrl = the full URL the client asked for.
export const notFound = (req, res, next) =>
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));

// FOUR arguments (err, req, res, next) is how Express recognises an error-handling middleware.
// Even if you do not use `next`, it must stay in the list, otherwise Express treats this as normal middleware.
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500; // ApiError carries its code; any other error is a server bug (500)
  res.status(statusCode).json({
    success: false,
    // In production hide the real message of a 500 (it can reveal internals); otherwise show it to help debugging.
    message: statusCode === 500 && process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    // `...(condition && { key: value })` adds the key to the object only when the condition is true.
    ...(err.errors && { errors: err.errors }), // validation details [{ field, message }], only when present
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }), // stack trace only in development
  });
};
