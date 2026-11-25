// =====================================================================================
// STEP 03 - Reading the request: params, query, body, headers
// Run:  node steps/03-request-response.js
// Test: requests.http (REST Client in VS Code) or the browser for the GET routes
//
// WHAT YOU LEARN
//   - req.params : values inside the path          /api/echo/42        -> { id: "42" }
//   - req.query  : values after the question mark  /api/search?q=asha  -> { q: "asha" }
//   - req.body   : JSON sent by the client (needs express.json())
//   - everything arrives as a STRING, convert numbers yourself
//
// CONCEPT: a client can send data in three places. Choose by meaning:
//   path   = WHICH resource            (params)
//   query  = optional filters / paging (query)
//   body   = the data to create/change (body)
// =====================================================================================
import express from "express";

const app = express();

// app.use(middleware): registers a function that runs for EVERY request before the routes below.
// express.json() is a built-in middleware: if the request has "Content-Type: application/json" it reads the
// body, parses the JSON and stores the result in req.body. WITHOUT this line req.body is undefined.
// It must be registered BEFORE the routes that read req.body.
app.use(express.json());

// ":id" in the path is a PLACEHOLDER. The matching part of the real URL ends up in req.params.id.
app.get("/api/echo/:id", (req, res) => {
  const id = Number(req.params.id); // req.params values are strings: "42" -> 42
  res.json({ id, type: typeof id }); // { id: id, type: typeof id } written in short form
});

app.get("/api/search", (req, res) => {
  // req.query holds the part after "?" as an object: /api/search?q=asha&page=2 -> { q: "asha", page: "2" }.
  // Destructuring with defaults: take q and page out of the object; if a key is missing use the default value.
  const { q = "", page = "1" } = req.query;
  res.json({ q, page: Number(page) }); // convert page to a number before using it in calculations
});

app.post("/api/echo", (req, res) => {
  console.log("body:", req.body); // the parsed JSON object sent by the client
  // 201 = Created. req.get("header-name") reads a request header (the name is not case sensitive).
  res.status(201).json({ received: req.body, contentType: req.get("content-type") });
});

app.listen(5000, () => console.log("http://localhost:5000"));

// TRY: send a POST WITHOUT the express.json() line (comment it out). What is req.body?
