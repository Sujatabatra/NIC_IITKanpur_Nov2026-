// Import every exported function of the service under one name: service.list(), service.create() ...
import * as service from "../services/employee.service.js";
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/employees  (controllers only translate HTTP <-> service calls; the logic lives in the service)
export const getEmployees = asyncHandler(async (req, res) => {
  const { search, department, status, sort } = req.query; // query-string values (always strings)
  const page = Math.max(parseInt(req.query.page) || 1, 1); // text -> number; missing/invalid -> 1; never below 1
  const limit = Math.min(parseInt(req.query.limit) || 10, 100); // default 10; cap at 100 so nobody downloads everything
  // `...meta` collects total, page, limit, pages into one object; `items` is the array of employees
  const { items, ...meta } = await service.list({ search, department, status, sort, page, limit });
  res.status(200).json({ success: true, data: items, meta });
});

// GET /api/employees/stats
export const getStats = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: await service.stats() });
});

// GET /api/employees/:id
export const getEmployee = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: await service.getById(req.params.id) });
});

// POST /api/employees  -> 201 Created
export const createEmployee = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await service.create(req.body) });
});

// PUT / PATCH /api/employees/:id
export const updateEmployee = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: await service.update(req.params.id, req.body) });
});

// DELETE /api/employees/:id -> 204 No Content (empty body)
export const deleteEmployee = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.status(204).send();
});
