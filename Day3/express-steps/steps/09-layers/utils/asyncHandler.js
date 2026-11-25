// =====================================================================================
// utils/asyncHandler.js - wraps an async controller so a rejected promise (a thrown error) goes to next(err).
// Without it, an error inside an async function in Express 4 would never reach the error handler.
// Express 5 already forwards rejected promises itself; the wrapper keeps the code Express-4 safe
// and makes the idea explicit.
//
// USAGE:  export const getEmployee = asyncHandler(async (req, res) => { ... });
//
// HOW IT READS: asyncHandler(fn) is a function that RETURNS another function (req, res, next) => ...
//   fn(req, res, next)   runs your async controller (it returns a promise)
//   Promise.resolve(x)   turns the result into a promise, even if fn returned a plain value
//   .catch(next)         if the promise rejects, call next(error): Express jumps to the error handler
// =====================================================================================
export default (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
