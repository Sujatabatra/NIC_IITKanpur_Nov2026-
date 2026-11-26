import Employee from "../models/Employee.js"; // the employees collection
import ApiError from "../utils/ApiError.js"; // errors with a status code

// user text must never become a regex pattern
// Put a backslash before every regex special character so "a.b" is searched literally ("$&" = the matched character).
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Only these fields may be used for sorting (a whitelist: stops clients sorting by arbitrary fields).
const SORTABLE = ["name", "salary", "createdAt", "joiningDate"];

// LIST with search, filters, sorting and pagination. Options come from the controller; page/limit have defaults.
export const list = async ({ search, department, status, sort, page = 1, limit = 10 }) => {
  const filter = {}; // MongoDB filter built from whatever the client supplied
  if (search) {
    const rx = new RegExp(escapeRegex(search), "i"); // safe, case-insensitive pattern
    filter.$or = [{ name: rx }, { email: rx }, { position: rx }]; // match in ANY of the three fields
  }
  if (department) filter.department = department; // exact department id
  if (status) filter.status = status; // "active" or "inactive"

  // ?sort=salary (ascending) or ?sort=-salary (descending); default: newest first
  let sortBy = { createdAt: -1 };
  // strip a leading "-" and accept the field only if it is whitelisted
  if (sort && SORTABLE.includes(sort.replace(/^-/, ""))) {
    // computed key: the field name; value: -1 (descending) when the text started with "-", else 1
    sortBy = { [sort.replace(/^-/, "")]: sort.startsWith("-") ? -1 : 1 };
  }

  // run the page query and the total count at the same time and wait for both
  const [items, total] = await Promise.all([
    Employee.find(filter)
      .populate("department", "name") // replace the ObjectId with { _id, name }
      .sort(sortBy)
      .skip((page - 1) * limit) // skip earlier pages
      .limit(limit), // at most `limit` rows
    Employee.countDocuments(filter), // total matches across all pages
  ]);
  // pages = total divided by page size, rounded up
  return { items, total, page, limit, pages: Math.ceil(total / limit) };
};

// One employee by id, or a 404.
export const getById = async (id) => {
  const emp = await Employee.findById(id).populate("department", "name");
  if (!emp) throw new ApiError(404, "Employee not found");
  return emp;
};

// Create an employee; the schema validates it.
export const create = async (data) => {
  const emp = await Employee.create(data); // duplicate email -> Mongo error 11000 -> handled centrally
  return emp.populate("department", "name"); // return it with the department name filled in
};

// Update an employee and return the NEW version.
export const update = async (id, data) => {
  // returnDocument "after" = give back the updated doc; runValidators applies the schema rules to the update
  const emp = await Employee.findByIdAndUpdate(id, data, { returnDocument: "after", runValidators: true }).populate("department", "name");
  if (!emp) throw new ApiError(404, "Employee not found");
  return emp;
};

// Delete an employee, or 404 if it does not exist.
export const remove = async (id) => {
  const emp = await Employee.findByIdAndDelete(id);
  if (!emp) throw new ApiError(404, "Employee not found");
};

// aggregation pipeline demo (used by the Day 5 dashboard)
export const stats = async () => {
  // Overall numbers: one bucket (_id: null) with count, average and sum of salary. Destructure the single result.
  const [totals] = await Employee.aggregate([
    { $group: { _id: null, total: { $sum: 1 }, avgSalary: { $avg: "$salary" }, totalSalary: { $sum: "$salary" } } },
  ]);
  // Per department: group, join the department document, flatten it, pick the fields, sort by size.
  const byDepartment = await Employee.aggregate([
    { $group: { _id: "$department", count: { $sum: 1 }, avgSalary: { $avg: "$salary" } } },
    { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "dept" } }, // join
    { $unwind: "$dept" }, // one-item array -> object
    { $project: { _id: 0, department: "$dept.name", count: 1, avgSalary: { $round: ["$avgSalary", 0] } } }, // output shape
    { $sort: { count: -1 } },
  ]);
  return {
    total: totals?.total ?? 0, // ?. and ?? give 0 when the collection is empty (totals is undefined)
    avgSalary: Math.round(totals?.avgSalary ?? 0),
    totalSalary: totals?.totalSalary ?? 0,
    byDepartment,
  };
};
