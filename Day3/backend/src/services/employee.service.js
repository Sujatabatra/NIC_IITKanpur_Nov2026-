// =====================================================================================
// services/employee.service.js - the SERVICE layer: business rules + data access.
// There is NO req or res in this file, so it knows nothing about HTTP. It throws ApiError for problems.
// On Day 4 ONLY this file is replaced by a MongoDB version; routes and controllers stay the same.
// Every function is async already, because database calls are asynchronous (an async function always
// returns a promise, so callers use await).
// =====================================================================================
import ApiError from "../utils/ApiError.js";

// In-memory "database": a plain array of objects. It resets whenever the server restarts.
// `let` (not const) because remove() assigns a new array to it.
let employees = [
  { id: 1, name: "Asha Verma", email: "asha@example.com", position: "Developer", department: "IT", salary: 60000 },
  { id: 2, name: "Ravi Kumar", email: "ravi@example.com", position: "HR Executive", department: "HR", salary: 45000 },
  { id: 3, name: "Meera Nair", email: "meera@example.com", position: "Tech Lead", department: "IT", salary: 85000 },
];
let nextId = 4; // next free id (a real database generates ids itself)

// LIST with search, filter, sort and pagination.
// The parameter `{ search, department, sort, page = 1, limit = 10 }` destructures one object argument
// and gives page and limit default values.
export const list = async ({ search, department, sort, page = 1, limit = 10 }) => {
  let result = employees; // start with everything and narrow it down

  // search: case-insensitive match on name or email.
  // Array.filter(fn) keeps the elements for which fn returns true; String.includes(x) checks for a substring.
  if (search) {
    const q = search.toLowerCase();
    result = result.filter((e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q));
  }
  // filter: exact department
  if (department) result = result.filter((e) => e.department === department);

  if (sort) {
    // ?sort=salary (ascending) or ?sort=-salary (descending)
    const dir = sort.startsWith("-") ? -1 : 1; // a leading minus flips the direction
    const key = sort.replace(/^-/, ""); // field name without the minus (regex ^- = a minus at the start)
    // [...result] copies the array first, because Array.sort() changes the array it is called on.
    // The compare function returns >0, <0 or 0 to say which of a and b comes first; * dir reverses it.
    result = [...result].sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * dir);
  }

  // pagination: skip (page-1)*limit rows, take the next `limit` rows. Array.slice(from, toExclusive) copies a part.
  const total = result.length;
  const start = (page - 1) * limit;
  // Math.ceil rounds up: 5 rows with 2 per page = 3 pages
  return { items: result.slice(start, start + limit), total, page, limit, pages: Math.ceil(total / limit) };
};

// READ one. The id arrives as a string from the URL, so convert with Number().
// Array.find(fn) returns the first element where fn is true, or undefined when none matches.
export const getById = async (id) => {
  const emp = employees.find((e) => e.id === Number(id));
  // `throw` stops this function and hands the error to Express; the central errorHandler turns it into JSON.
  if (!emp) throw new ApiError(404, "Employee not found");
  return emp;
};

// CREATE. Business rule: emails must be unique, so a duplicate is 409 Conflict (not a 400 validation error).
// Array.some(fn) returns true if at least one element passes the test.
export const create = async (data) => {
  if (employees.some((e) => e.email === data.email)) throw new ApiError(409, "Email already exists");
  const emp = { id: nextId++, ...data }; // new id first (then nextId grows), then the fields copied with the spread operator
  employees.push(emp); // Array.push adds to the end
  return emp;
};

// UPDATE. getById throws 404 when missing. Object.assign(target, source) copies the given fields onto the
// stored object and keeps the rest; PUT and PATCH both end up here, the difference is only in which
// validators ran in the route.
export const update = async (id, data) => {
  const emp = await getById(id);
  Object.assign(emp, data);
  return emp;
};

// DELETE. Check it exists first (404 otherwise), then keep every employee except that one.
export const remove = async (id) => {
  const emp = await getById(id);
  employees = employees.filter((e) => e.id !== emp.id);
};

// STATS (lab): count and average salary per department, plus company totals.
export const stats = async () => {
  const groups = {}; // will look like { IT: { department, count, total }, HR: {...} }
  for (const e of employees) {
    // `x ??= value` assigns only if x is undefined: it creates the group the first time a department is seen.
    const g = (groups[e.department] ??= { department: e.department, count: 0, total: 0 });
    g.count++; // one more employee in this department
    g.total += e.salary; // running salary total
  }
  // Object.values(obj) returns the values as an array; map() reshapes each group.
  const byDepartment = Object.values(groups).map((g) => ({
    department: g.department,
    count: g.count,
    avgSalary: Math.round(g.total / g.count), // round to a whole number
  }));
  // Array.reduce(fn, start) folds the array into one value: here the sum of all salaries.
  const totalSalary = employees.reduce((s, e) => s + e.salary, 0);
  return {
    total: employees.length,
    avgSalary: employees.length ? Math.round(totalSalary / employees.length) : 0, // avoid dividing by zero
    totalSalary,
    byDepartment,
  };
};
