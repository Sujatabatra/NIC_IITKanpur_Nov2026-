// =====================================================================================
// controllers/employee.controller.js - the CONTROLLER layer.
// A controller speaks HTTP only: it reads req, calls the service, chooses the status code and writes res.
// Business rules and data access are NOT here, they live in services/.
// Every function is wrapped in asyncHandler so a thrown error reaches the central errorHandler.
//
// USAGE of asyncHandler(fn): returns a new middleware (req, res, next) that runs your async function and,
// if it throws or rejects, calls next(error) so Express jumps to the error handler.
// =====================================================================================
import * as service from "../services/employee.service.js"; // all service functions as service.list, service.create ...
import asyncHandler from "../utils/asyncHandler.js";

// GET /api/employees?search=&department=&sort=&page=&limit=
export const getEmployees = asyncHandler(async (req, res) => {
  // Destructuring: pull three keys out of the req.query object into variables.
  const { search, department, sort } = req.query;

  // Query values are strings. parseInt converts to a whole number (NaN when missing, which is falsy,
  // so `|| 1` supplies the default). Math.max/Math.min keep the value in a safe range.
  const page = Math.max(parseInt(req.query.page) || 1, 1); // never below 1
  const limit = Math.min(parseInt(req.query.limit) || 10, 100); // never above 100

  // `await` waits for the service's promise. The service returns { items, total, page, limit, pages }.
  // `{ items, ...meta }` is destructuring with a REST: items goes into its own variable and
  // everything else (total, page, limit, pages) is collected into the object `meta`.
  const { items, ...meta } = await service.list({ search, department, sort, page, limit });

  // res.status(code).json(body): set the status, then send JSON. { success, data, meta } is our response envelope.
  res.status(200).json({ success: true, data: items, meta });
});

// GET /api/employees/stats - count and average salary per department
export const getStats = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: await service.stats() });
});

// GET /api/employees/:id - req.params.id is a string; the service converts it. A missing id makes the
// service throw ApiError(404), which asyncHandler forwards to the errorHandler.
export const getEmployee = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: await service.getById(req.params.id) });
});

// POST /api/employees - req.body was already validated and cleaned in the route. 201 = Created.
export const createEmployee = asyncHandler(async (req, res) => {
  res.status(201).json({ success: true, data: await service.create(req.body) });
});

// PUT and PATCH /api/employees/:id - both use this controller; the route's validators decide full vs partial.
export const updateEmployee = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, data: await service.update(req.params.id, req.body) });
});

// DELETE /api/employees/:id - 204 = success with no response body, so we use send() with nothing in it.
export const deleteEmployee = asyncHandler(async (req, res) => {
  await service.remove(req.params.id);
  res.status(204).send();
});
