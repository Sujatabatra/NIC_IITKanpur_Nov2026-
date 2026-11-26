// =====================================================================================
// STEP 07 - Express + Mongoose: the Day 3 CRUD API, now backed by a real database
// Run:  node steps/07-express-crud.js        Test with requests.http (section 07)
//
// WHAT YOU LEARN
//   - connect FIRST, then app.listen: the API never accepts traffic it cannot serve
//   - the only thing that changes from Day 3 is WHERE the data lives (array -> MongoDB)
//   - async handlers: every database call is awaited
//   - mapping database errors to HTTP: validation -> 400, bad id -> 400, duplicate -> 409, missing -> 404
//   - data now SURVIVES a restart (stop the server, start it again, GET the list)
// =====================================================================================

// Express: the web framework.
import express from "express";
// Our connection helper, and the settings written in lib/config.js.
import { connect } from "../lib/db.js";
import { PORT } from "../lib/config.js";
// Shared Mongoose models.
import { Department, Employee } from "../lib/models.js";

// Create the application object; routes and middleware are attached to it.
const app = express();
// Middleware: parse JSON request bodies and put the result in req.body.
app.use(express.json());

// LIST. populate() replaces the department id with { _id, name }.
// app.get(path, handler): runs the handler for GET /api/employees. req = request, res = response.
app.get("/api/employees", async (req, res) => {
  // find() with no filter = all employees; populate swaps the id for the department; newest first.
  const items = await Employee.find().populate("department", "name").sort({ createdAt: -1 });
  // 200 OK is the default status; send JSON with a success flag, a count and the data.
  res.json({ success: true, count: items.length, data: items });
});

// ":id" is a path parameter, available as req.params.id (a string).
app.get("/api/employees/:id", async (req, res) => {
  const emp = await Employee.findById(req.params.id).populate("department", "name"); // bad id -> CastError
  // No document with that id -> 404 Not Found. `return` stops the handler.
  if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });
  res.json({ success: true, data: emp });
});

// POST = create. The new employee arrives in req.body.
app.post("/api/employees", async (req, res) => {
  const emp = await Employee.create(req.body); // schema validation + unique index run here
  // 201 Created; populate the department on the saved document so the reply is readable.
  res.status(201).json({ success: true, data: await emp.populate("department", "name") });
});

// PATCH = change only the fields that were sent.
app.patch("/api/employees/:id", async (req, res) => {
  // returnDocument:"after" -> reply with the updated document; runValidators -> apply schema rules to the update.
  const emp = await Employee.findByIdAndUpdate(req.params.id, req.body, { returnDocument: "after", runValidators: true });
  if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });
  res.json({ success: true, data: emp });
});

// DELETE = remove one employee.
app.delete("/api/employees/:id", async (req, res) => {
  const emp = await Employee.findByIdAndDelete(req.params.id); // returns the deleted doc, or null if none
  if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });
  res.status(204).end(); // 204 No Content: success with an empty body
});

// Departments are needed to create an employee (we need an id to reference).
// One-line handlers: list all departments sorted by name; create one (201).
app.get("/api/departments", async (req, res) => res.json({ success: true, data: await Department.find().sort("name") }));
app.post("/api/departments", async (req, res) => res.status(201).json({ success: true, data: await Department.create(req.body) }));

// ---- ONE central error handler (4 arguments = error handler). Express 5 sends rejected promises here for us. ----
app.use((err, req, res, next) => {
  let status = err.statusCode || 500; // use the error's own status if it has one, else 500 Server Error
  let message = err.message; // default text
  let errors; // optional per-field details
  if (err.name === "ValidationError") {
    status = 400; // client sent invalid data
    message = "Validation failed";
    // turn Mongoose's error object into an array of { field, message }
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === "CastError") {
    status = 400; // e.g. /api/employees/123 : "123" is not a valid ObjectId
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.code === 11000) {
    status = 409; // unique index violated -> 409 Conflict
    message = `${Object.keys(err.keyValue)[0]} already exists`; // first key = the duplicated field, e.g. "email"
  }
  if (status === 500) console.error(err); // log unexpected bugs on the server
  // `...(errors && {...})` adds the "errors" key only when errors exists.
  res.status(status).json({ success: false, message, ...(errors && { errors }) });
});

// Connect to MongoDB FIRST; if it fails the script stops with an error and never listens.
await connect();
// PORT (5000) is written in lib/config.js.
// Start accepting HTTP requests; the callback runs once the port is open.
app.listen(PORT, () => console.log(`step 07 running on http://localhost:${PORT}`));

// TRY IT: create a department, then an employee with that id (see requests.http). Stop and restart: the data is still there.
// TRY IT: GET /api/employees/123 -> 400 (not a crash). POST the same email twice -> 409.
// NEXT: anyone can still delete everything. Steps 08-10 add logins.
