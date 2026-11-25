// =====================================================================================
// routes/employee.routes.js - the ROUTE layer.
// It answers: "which URL + HTTP method calls which controller function, and which validation runs first?"
// It does NOT contain business logic or database code.
// =====================================================================================
import { Router } from "express";

// express-validator helpers: body("field"), param("field"), query("field") start a rule chain for that part
// of the request. Rules only RECORD failures; the validate middleware reports them.
import { body, param, query } from "express-validator";
import validate from "../middleware/validate.js";

// `import * as c` loads every exported function of the controller file into one object, used as c.getEmployee ...
import * as c from "../controllers/employee.controller.js";

// Router() creates a mini-app for ONE resource. app.js mounts it at /api/employees, so "/" below means
// /api/employees and "/:id" means /api/employees/:id.
const router = Router();

// ---- Validation rules --------------------------------------------------------------------------
// A chain reads left to right: choose the field, then validators (check) and sanitizers (clean).

// URL values are text, so the TEXT is checked to be a whole number >= 1.
// withMessage(...) is the error text for the rule written just before it.
const idRule = param("id").isInt({ min: 1 }).withMessage("id must be a positive integer");

// POST and PUT: every field is required.
//   trim()            removes spaces around the text (sanitizer)
//   notEmpty()        must contain something (validator)
//   isEmail()         must look like an email
//   normalizeEmail()  converts to a standard form (lower case)
//   isFloat({ gt: 0 })  a number greater than 0
//   toFloat()         converts the text "50000" to the number 50000 (sanitizer)
const createRules = [
  body("name").trim().notEmpty().withMessage("name is required"),
  body("email").trim().isEmail().withMessage("valid email required").normalizeEmail(),
  body("position").trim().notEmpty().withMessage("position is required"),
  body("department").trim().notEmpty().withMessage("department is required"),
  body("salary").isFloat({ gt: 0 }).withMessage("salary must be > 0").toFloat(),
];

// PATCH = partial update: the same checks, but optional() means "only validate this field if it was sent".
const patchRules = [
  body("name").optional().trim().notEmpty(),
  body("email").optional().trim().isEmail().normalizeEmail(),
  body("position").optional().trim().notEmpty(),
  body("department").optional().trim().notEmpty(),
  body("salary").optional().isFloat({ gt: 0 }).toFloat(),
];

// Rules for the query string of the list: ?page=2&limit=10 (both optional, limit capped at 100).
const listRules = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
];

// ---- Routes. Pattern: rules -> validate -> controller. Express runs them left to right. ----

// Declared BEFORE "/:id", otherwise Express would match the word "stats" as an id.
router.get("/stats", c.getStats);

// GET /api/employees : list (search, filter, sort, pagination)
router.get("/", listRules, validate, c.getEmployees);

// POST /api/employees : CREATE a new employee. The JSON body is checked by createRules (all fields required),
// validate() answers 400 if a rule failed, otherwise c.createEmployee calls service.create and replies 201.
// A duplicate email is rejected by the service with 409. Test: requests.http, Postman or `npm run client`.
router.post("/", createRules, validate, c.createEmployee);

router
  .route("/:id")
  .get(idRule, validate, c.getEmployee) // read one
  .put(idRule, createRules, validate, c.updateEmployee) // PUT = replace the whole record: all fields required
  .patch(idRule, patchRules, validate, c.updateEmployee) // PATCH = change some fields: all optional
  .delete(idRule, validate, c.deleteEmployee); // remove

export default router; // app.js imports this as employeeRoutes
