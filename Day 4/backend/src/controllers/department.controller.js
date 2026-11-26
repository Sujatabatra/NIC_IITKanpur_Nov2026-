import Department from "../models/Department.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/departments: all departments, alphabetical by name.
export const getDepartments = asyncHandler(async (req, res) => {
  res.json({ success: true, data: await Department.find().sort("name") });
});

// POST /api/departments: create one from the request body; 201 Created.
export const createDepartment = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await Department.create(req.body) });
});
