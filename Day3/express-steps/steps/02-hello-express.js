// =====================================================================================
// STEP 02 - The same server in Express
// Run:  node steps/02-hello-express.js     then open http://localhost:5000/api/health
//
// WHAT YOU LEARN
//   - app.get(path, handler) is routing: one line per route
//   - res.json() sets the status, the Content-Type header and converts to JSON for you
//   - the port comes from an environment variable, with a default
//   - Express 5 is a normal npm package: npm install express
//
// CONCEPT: Express is a small FRAMEWORK built on Node's http module. It adds easy routing, helpers for
// responses (res.json, res.status) and middleware (step 04). You still receive req and res, but they are
// extended with many useful methods.
// =====================================================================================
import express from "express";

// express() creates the application object. Everything (routes, middleware) is registered on it.
const app = express();

// process.env.PORT is a string or undefined; `||` supplies the default 5000 when it is missing.
const PORT = process.env.PORT || 5000;

// app.get(path, handler)
//   USAGE: register a route. When a GET request for exactly `path` arrives, Express calls handler(req, res).
//   (Other verbs work the same way: app.post, app.put, app.patch, app.delete.)
app.get("/", (req, res) => {
  // res.send(x): sends text or HTML. Express sets the Content-Type for you.
  res.send("Hello from Express");
});

app.get("/api/health", (req, res) => {
  // res.json(obj): converts the object to JSON, sets "Content-Type: application/json", status 200 by default.
  // process.uptime() = seconds since this program started.
  res.json({ status: "ok", uptime: process.uptime() });
});

app.get("/api/teapot", (req, res) => {
  // res.status(code) sets the status and RETURNS res, so you can chain .json(...) on it.
  // Always set the status BEFORE sending. 418 is a joke status code ("I'm a teapot") used here for demonstration.
  res.status(418).json({ message: "I am a teapot" });
});

// POST route: app.post(path, handler) answers POST requests, which carry a JSON body.
// express.json() (built-in middleware, explained in step 03) reads that body into req.body; without it req.body is undefined.
app.use(express.json());
app.post("/api/messages", (req, res) => {
  const { text } = req.body; // destructuring: take the `text` field out of the body object
  // Minimal check: step 06 shows proper validation. 400 = Bad Request.
  if (!text) return res.status(400).json({ message: "text is required" });
  res.status(201).json({ message: `Received: ${text}` }); // 201 = Created
});

// Any URL that matches no route gets Express's default 404 page (step 04 shows how to customise it).

// app.listen(port, callback): the same as server.listen in step 01; Express creates the http server for you.
app.listen(PORT, () => console.log(`Express on http://localhost:${PORT}`));
