// =====================================================================================
// utils/ApiError.js - an Error that carries an HTTP status code (and optional field errors).
// Usage anywhere: throw new ApiError(404, "Employee not found");
// The central errorHandler reads statusCode and errors to build the JSON response.
//
// CONCEPT: `class ApiError extends Error` creates a new kind of error that behaves like a normal Error
// (it has a message and a stack trace) and adds our own fields.
// =====================================================================================
export default class ApiError extends Error {
  constructor(statusCode, message, errors) {
    super(message); // super(...) calls the Error constructor: sets err.message and records the stack trace
    this.statusCode = statusCode; // e.g. 400, 404, 409
    this.errors = errors; // optional list such as [{ field, message }] for validation failures
  }
}
