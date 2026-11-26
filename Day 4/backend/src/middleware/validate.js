import { validationResult } from "express-validator"; // collects the results of the body()/param()/query() rules
import ApiError from "../utils/ApiError.js";

// Place this AFTER the validation rules in a route. It either continues or turns the problems into a 400.
export default (req, res, next) => {
  const result = validationResult(req); // everything the rules found wrong for this request
  if (result.isEmpty()) return next(); // no problems -> go on to the controller
  // reshape each problem to { field, message } (e.path = field name, e.msg = message)
  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  next(new ApiError(400, "Validation failed", errors)); // 400 Bad Request with the details
};
