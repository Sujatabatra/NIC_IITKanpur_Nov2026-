import { Router } from "express";
import { body, param, query } from "express-validator"; // rules for body, URL parameters and query string
import validate from "../middleware/validate.js";
import { protect, authorize } from "../middleware/auth.js";
import * as c from "../controllers/employee.controller.js"; // c.getEmployees, c.createEmployee ...

const router = Router(); // mounted at /api/employees in app.js

// :id in the URL must be a valid 24-character MongoDB ObjectId
const idRule = param("id").isMongoId().withMessage("Invalid employee id");

// Full set of rules for creating (and replacing with PUT) an employee: every field is required.
const createRules = [
  body("name").trim().notEmpty().withMessage("name is required").isLength({ max: 100 }),
  body("email").trim().isEmail().withMessage("valid email required").normalizeEmail(),
  body("position").trim().notEmpty().withMessage("position is required"),
  body("department").isMongoId().withMessage("department must be a valid id"),
  body("salary").isFloat({ gt: 0 }).withMessage("salary must be > 0").toFloat(), // toFloat converts "5000" to 5000
  body("status").optional().isIn(["active", "inactive"]), // optional(): only checked when present
];
// PATCH rules: same checks, but every field is optional because only some are sent.
const patchRules = [
  body("name").optional().trim().notEmpty().isLength({ max: 100 }),
  body("email").optional().trim().isEmail().normalizeEmail(),
  body("position").optional().trim().notEmpty(),
  body("department").optional().isMongoId(),
  body("salary").optional().isFloat({ gt: 0 }).toFloat(),
  body("status").optional().isIn(["active", "inactive"]),
];
// Rules for the list query string (?page=&limit=&department=&status=).
const listRules = [
  query("page").optional().isInt({ min: 1 }),
  query("limit").optional().isInt({ min: 1, max: 100 }),
  query("department").optional().isMongoId(),
  query("status").optional().isIn(["active", "inactive"]),
];

router.use(protect); // every employee route needs a logged-in user

// "/stats" must be declared BEFORE "/:id", otherwise Express would treat the word "stats" as an id.
router.get("/stats", c.getStats); // BEFORE "/:id"
router
  .route("/") // several verbs on the same path
  .get(listRules, validate, c.getEmployees) // any logged-in role
  .post(authorize("admin"), createRules, validate, c.createEmployee); // admin only
router
  .route("/:id")
  .get(idRule, validate, c.getEmployee) // any logged-in role
  .put(authorize("admin"), idRule, createRules, validate, c.updateEmployee) // replace: all fields required
  .patch(authorize("admin"), idRule, patchRules, validate, c.updateEmployee) // partial update
  .delete(authorize("admin"), idRule, validate, c.deleteEmployee);

export default router;
