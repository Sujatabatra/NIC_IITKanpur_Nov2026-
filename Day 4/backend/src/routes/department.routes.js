import { Router } from "express";
import { body } from "express-validator";
import validate from "../middleware/validate.js";
import { protect, authorize } from "../middleware/auth.js";
import { getDepartments, createDepartment } from "../controllers/department.controller.js";

const router = Router(); // mounted at /api/departments in app.js

router.use(protect); // every route below requires a logged-in user
router.get("/", getDepartments); // any logged-in role may read
// admins only; then check name, turn failures into a 400, then run the controller
router.post("/", authorize("admin"), body("name").trim().notEmpty().withMessage("name is required"), validate, createDepartment);

export default router;
