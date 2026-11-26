// Express 5 forwards rejected promises automatically; this wrapper keeps the code
// Express-4 safe and makes the idea of async error handling explicit.
// It takes an async route function `fn` and returns a normal Express handler (req, res, next).
// Promise.resolve(...) makes sure the result is a promise; .catch(next) sends any error to the error handler
// instead of leaving it as an unhandled rejection that would hang the request.
export default (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
