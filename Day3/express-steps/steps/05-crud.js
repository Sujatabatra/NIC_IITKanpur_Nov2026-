// =====================================================================================
// STEP 05 - A REST API: CRUD for employees (in-memory, one file)
// Run:  node steps/05-crud.js        Test with requests.http
//
// WHAT YOU LEARN
//   - REST = resources (nouns in the URL) + HTTP verbs (the action)
//   - GET list, GET one, POST create, PUT/PATCH update, DELETE remove
//   - the right status code: 200 OK, 201 Created, 204 No Content, 404 Not Found
//   - express.Router groups the routes of one resource
//   - data is a plain array: it resets when the server restarts (MongoDB comes on Day 4)
//
// CONCEPT: CRUD = Create, Read, Update, Delete, the four things you do with stored data.
//   Create -> POST    Read -> GET    Update -> PUT / PATCH    Delete -> DELETE
// =====================================================================================
import express from "express";

// The "database": an array of objects. `let` (not const) because DELETE assigns a new array to it.
let employees = [
  { id: 1, name: "Asha Verma", email: "asha@example.com", position: "Developer", department: "IT", salary: 60000 },
  { id: 2, name: "Ravi Kumar", email: "ravi@example.com", position: "HR Executive", department: "HR", salary: 45000 },
];
let nextId = 3; // a real database generates ids; here we count ourselves

// express.Router() creates a mini-app that holds the routes of ONE resource. It is mounted at the bottom.
// Inside the router, paths are written relative to the mount point ("/" means /api/employees).
const router = express.Router();

// READ (list): 200 OK with every employee.
router.get("/", (req, res) => res.status(200).json({ success: true, data: employees }));

// READ (one): ":id" is a path parameter (always a string).
router.get("/:id", (req, res) => {
  // Array.find(fn) returns the FIRST element for which fn returns true, or undefined if none does.
  // Number(...) converts the string id so it can be compared with the numeric e.id.
  const emp = employees.find((e) => e.id === Number(req.params.id));
  // 404 Not Found. `return` stops the function so the line below does not run too.
  if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });
  res.json({ success: true, data: emp });
});

// CREATE: the new employee comes from req.body (parsed by express.json() below).
router.post("/", (req, res) => {
  // { id: nextId++, ...req.body } builds a NEW object: first the id (then nextId increases by one),
  // then the spread operator `...` copies every field of req.body into it.
  const emp = { id: nextId++, ...req.body }; // no validation yet: step 06 fixes that
  employees.push(emp); // Array.push adds an element at the end
  res.status(201).json({ success: true, data: emp }); // 201 = Created
});

// UPDATE (PUT replaces the whole record, PATCH changes only the fields that were sent)
router.put("/:id", (req, res) => {
  // Array.findIndex(fn) returns the POSITION of the first match, or -1 when nothing matches.
  const i = employees.findIndex((e) => e.id === Number(req.params.id));
  if (i === -1) return res.status(404).json({ success: false, message: "Employee not found" });
  // Replace the stored object completely. Fields missing from req.body are LOST. Keep the original id.
  employees[i] = { id: employees[i].id, ...req.body };
  res.json({ success: true, data: employees[i] });
});

router.patch("/:id", (req, res) => {
  const emp = employees.find((e) => e.id === Number(req.params.id));
  if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });
  // Object.assign(target, source) copies the fields of source onto target, keeping the other fields.
  Object.assign(emp, req.body);
  res.json({ success: true, data: emp });
});

// DELETE
router.delete("/:id", (req, res) => {
  const before = employees.length;
  // Array.filter(fn) returns a NEW array with only the elements for which fn is true:
  // keep everybody whose id is NOT the one in the URL.
  employees = employees.filter((e) => e.id !== Number(req.params.id));
  // If the length did not change, nothing was removed, so that id did not exist.
  if (employees.length === before) return res.status(404).json({ success: false, message: "Employee not found" });
  res.status(204).send(); // 204 No Content: success, and there is nothing to return
});

const app = express();
app.use(express.json()); // needed so POST/PUT/PATCH bodies reach req.body

// app.use(path, router): mounts the router. Every route above is now under /api/employees.
// Example: router.get("/:id") becomes GET /api/employees/:id
app.use("/api/employees", router);
app.listen(5000, () => console.log("http://localhost:5000/api/employees"));

// PROBLEMS you will see: POST accepts garbage (empty name, salary "abc") and the 404 code is repeated everywhere.
// Step 06 adds validation, step 07 removes the repetition.
