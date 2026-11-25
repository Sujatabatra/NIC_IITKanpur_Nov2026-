// =====================================================================================
// STEP 07 - Central error handling
// Run:  node steps/07-error-handling.js        Test with requests.http
//
// WHAT YOU LEARN
//   - instead of building the error response in every route, THROW an ApiError
//   - an error-handling middleware has FOUR arguments (err, req, res, next) and goes LAST
//   - one notFound middleware turns unknown URLs into the same JSON shape
//   - asyncHandler forwards rejected promises to the error handler (Express 5 does this itself too)
//   - every error now has the same JSON shape: { success: false, message }
//
// CONCEPT: when something goes wrong, THROW an error that carries an HTTP status code. Express catches it,
// skips the remaining normal middleware and calls the ERROR HANDLER, which writes the response in ONE place.
// =====================================================================================
import express from "express";

// ---- an Error that carries an HTTP status code ----------------------------------------
// `class X extends Error` makes our own error type that behaves like a normal Error (message, stack trace)
// and adds a statusCode field. super(message) calls the Error constructor.
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

// asyncHandler(fn) returns a NEW middleware that runs fn and sends any failure to next(err).
//   Promise.resolve(x)  turns x (a value or a promise) into a promise,
//   .catch(next)        if it rejects, call next(error): Express then jumps to the error handler.
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

let employees = [{ id: 1, name: "Asha Verma", email: "asha@example.com", salary: 60000 }];
let nextId = 2;

// One helper holds the "not found" rule, so every route stays short.
const findOrFail = (id) => {
  const emp = employees.find((e) => e.id === Number(id));
  // `throw` stops this function immediately and hands the error to Express.
  if (!emp) throw new ApiError(404, "Employee not found"); // one place, no repeated res.status(404)...
  return emp;
};

const app = express();
app.use(express.json());

// A synchronous route: if findOrFail throws, Express catches the error automatically.
app.get("/api/employees/:id", (req, res) => res.json({ success: true, data: findOrFail(req.params.id) }));

app.post(
  "/api/employees",
  // async handlers return a promise; asyncHandler makes sure a rejection is passed to the error handler.
  asyncHandler(async (req, res) => {
    // Array.some(fn) returns true if at least ONE element passes the test.
    // A duplicate email is a business rule, not a shape problem, so it is 409 Conflict (not 400).
    if (employees.some((e) => e.email === req.body.email)) throw new ApiError(409, "Email already exists");
    const emp = { id: nextId++, ...req.body };
    employees.push(emp);
    res.status(201).json({ success: true, data: emp });
  })
);

app.get("/api/crash", () => {
  throw new Error("Something unexpected broke"); // a bug: a plain Error has no statusCode, so it becomes a 500
});

// ---- the last two middleware --------------------------------------------------------------
// 1) notFound: reached only when no route above answered. next(err) with an argument means "this is an error":
//    Express skips normal middleware and goes straight to the error handler below.
app.use((req, res, next) => next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`)));

// 2) The error handler. FOUR parameters (err, req, res, next) are how Express recognises it. It must be LAST.
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500; // our errors carry a code; unexpected ones default to 500
  res.status(statusCode).json({
    success: false,
    // In production do not leak the real message of a 500 (it may reveal internals).
    message: statusCode === 500 && process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    // `...(condition && { key: value })` adds the key only when the condition is true.
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }), // stack traces only in development
  });
});

app.listen(5000, () => console.log("http://localhost:5000/api/employees/1"));

// TRY: GET /api/employees/99 (404), POST the same email twice (409), GET /api/crash (500), GET /nothing (404).
