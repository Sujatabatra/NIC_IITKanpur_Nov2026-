// =====================================================================================
// STEP 06 - Validating input with express-validator
// Run:  node steps/06-validation.js        Test with requests.http (send bad data!)
//
// WHAT YOU LEARN
//   - NEVER trust req.body, req.params or req.query: validate every one
//   - validation rules are middleware placed BEFORE the handler
//   - one shared "validate" middleware turns rule failures into a 400 response
//   - sanitizers (trim, normalizeEmail, toFloat) clean the data as well
//   - PATCH rules are the same rules marked optional()
// (Same as step 05, only the new parts are commented.)
//
// CONCEPT: anything from outside can be wrong: missing, the wrong type, too long, or malicious. Validation
// checks the SHAPE of the input before your handler runs, so the handler can trust what it receives.
// =====================================================================================
import express from "express";

// body(field), param(field), query(field) start a rule chain for that part of the request.
// validationResult(req) returns the list of rules that failed for this request.
import { body, param, validationResult } from "express-validator";

let employees = [
  { id: 1, name: "Asha Verma", email: "asha@example.com", position: "Developer", department: "IT", salary: 60000 },
];
let nextId = 2;

// ---- the rules -----------------------------------------------------------------------
// A rule chain reads left to right: pick the field, then validators (check) and sanitizers (clean).
//   isInt({ min: 1 })    validator: whole number of at least 1 (URL values are text, so the text is checked)
//   withMessage("...")   the message used when the rule BEFORE it fails
const idRule = param("id").isInt({ min: 1 }).withMessage("id must be a positive integer");

const createRules = [
  body("name").trim().notEmpty().withMessage("name is required"), // trim() = sanitizer that removes surrounding spaces
  body("email").trim().isEmail().withMessage("valid email required").normalizeEmail(), // normalizeEmail = standard form
  body("position").trim().notEmpty().withMessage("position is required"),
  body("department").trim().notEmpty().withMessage("department is required"),
  body("salary").isFloat({ gt: 0 }).withMessage("salary must be > 0").toFloat(), // gt = greater than; toFloat converts text to number
];

// PATCH sends only some fields, so each rule gets optional(): "validate this field only if it was sent".
const patchRules = [
  body("name").optional().trim().notEmpty(),
  body("email").optional().trim().isEmail().normalizeEmail(),
  body("position").optional().trim().notEmpty(),
  body("department").optional().trim().notEmpty(),
  body("salary").optional().isFloat({ gt: 0 }).toFloat(),
];

// ---- one middleware that checks the result of the rules ------------------------------
// The rules above do not stop anything by themselves, they only RECORD failures. This middleware reads them.
const validate = (req, res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next(); // no failures: continue to the handler

  // result.array() lists the failures; e.path = field name, e.msg = message. map() reshapes each item.
  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  // 400 = Bad Request (the client sent bad data). The handler is never reached.
  res.status(400).json({ success: false, message: "Validation failed", errors });
};

// ---- routes: rules -> validate -> handler --------------------------------------------
// Express runs the functions given to a route in the order written: rules, then validate, then the handler.
const router = express.Router();

router.get("/", (req, res) => res.json({ success: true, data: employees }));

router.get("/:id", idRule, validate, (req, res) => {
  const emp = employees.find((e) => e.id === Number(req.params.id));
  if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });
  res.json({ success: true, data: emp });
});

router.post("/", createRules, validate, (req, res) => {
  // At this point req.body is guaranteed valid AND cleaned (trimmed, salary is a number).
  const emp = { id: nextId++, ...req.body };
  employees.push(emp);
  res.status(201).json({ success: true, data: emp });
});

router.patch("/:id", idRule, patchRules, validate, (req, res) => {
  const emp = employees.find((e) => e.id === Number(req.params.id));
  if (!emp) return res.status(404).json({ success: false, message: "Employee not found" });
  Object.assign(emp, req.body); // copy only the fields that were sent
  res.json({ success: true, data: emp });
});

router.delete("/:id", idRule, validate, (req, res) => {
  employees = employees.filter((e) => e.id !== Number(req.params.id)); // keep everyone except this id
  res.status(204).send();
});


const app = express();
app.use(express.json());
app.use("/api/employees", router);
app.listen(5000, () => console.log("http://localhost:5000/api/employees"));

// TRY: POST { "name": "  ", "email": "nope", "salary": -5 } and read the errors array.
