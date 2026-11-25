// =====================================================================================
// middleware/validate.js - reports the result of the express-validator rules written in the route file.
// Placed AFTER the rules and BEFORE the controller: rules -> validate -> controller.
// The rules themselves never stop a request; they only record failures. This middleware reads them.
// =====================================================================================
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError.js";

export default (req, res, next) => {
  // validationResult(req) returns an object holding every rule that failed for this request.
  const result = validationResult(req);
  if (result.isEmpty()) return next(); // no failures: continue to the controller

  // result.array() lists the failures. Array.map(fn) builds a new array by converting every item:
  // e.path = field name, e.msg = the message from withMessage(...). The frontend can show it next to the right input.
  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  next(new ApiError(400, "Validation failed", errors)); // 400 Bad Request, formatted later by errorHandler
};
