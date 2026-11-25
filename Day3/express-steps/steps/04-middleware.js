// =====================================================================================
// STEP 04 - Middleware: functions that run before your route
// Run:  node steps/04-middleware.js     then call any URL and watch the terminal
//
// WHAT YOU LEARN
//   - middleware has the signature (req, res, next)
//   - next() passes control on; sending a response ends the chain
//   - ORDER MATTERS: Express runs middleware top to bottom
//   - middleware can be global (app.use), per path, or per route
//
// CONCEPT: Express keeps an ordered LIST of functions. For each request it calls them one after another.
// A middleware can (a) change req/res and call next() to continue, or (b) send a response, which stops the chain.
// Middleware is how logging, body parsing, security checks, validation and error handling are built.
// =====================================================================================
import express from "express";

const app = express();

// 1) Global middleware: app.use(fn) with no path runs for every request, whatever the URL or method.
app.use((req, res, next) => {
  const start = Date.now(); // remember when the request arrived (milliseconds)
  console.log("-> before handler:", req.method, req.url);

  // res.on("finish", fn): "finish" is an event (see node-steps/05-events.js) emitted by res after the
  // response has been fully sent. That is the right moment to log the final status and the total time.
  res.on("finish", () => console.log("<- after response:", res.statusCode, `${Date.now() - start}ms`));

  next(); // call the NEXT middleware/route in the list. WITHOUT next() the request hangs forever.
});

app.use(express.json()); // built-in body parser (step 03)

// 2) Middleware for ONE route only: a very simple "API key" check.
const requireKey = (req, res, next) => {
  // req.get reads a header. If the key is wrong we respond and STOP: note the `return`, so next() below is not reached.
  // 401 = Unauthorized (we do not know who you are).
  if (req.get("x-api-key") !== "secret123") return res.status(401).json({ message: "API key missing or wrong" });
  next(); // key is correct: continue to the route handler
};

app.get("/api/public", (req, res) => res.json({ message: "anyone can read this" }));

// app.get(path, middleware, handler): extra functions before the handler run in order, only for this route.
app.get("/api/private", requireKey, (req, res) => res.json({ message: "you have the key" }));

// A POST route protected by the same middleware. Order of execution: logger -> express.json() -> requireKey -> handler.
// Without the key header the request stops at requireKey (401) and the handler never runs.
app.post("/api/private", requireKey, (req, res) => res.status(201).json({ message: "saved", received: req.body }));

// 3) Placed AFTER all routes, so it runs only when no route above answered: a catch-all 404.
// req.originalUrl is the full URL as the client typed it.
app.use((req, res) => res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` }));

app.listen(5000, () => console.log("http://localhost:5000"));

// TRY: move the logging middleware to the bottom of the file. It never prints for matched routes. Why?
//      (A route that already sent a response never calls next(), so later middleware is not reached.)
