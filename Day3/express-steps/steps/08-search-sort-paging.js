// =====================================================================================
// STEP 08 - Search, filter, sort and pagination with query strings
// Run:  node steps/08-search-sort-paging.js
// Try:  /api/employees?search=asha
//       /api/employees?department=IT&sort=-salary
//       /api/employees?page=2&limit=2
//       /api/employees/stats
//
// WHAT YOU LEARN
//   - GET /collection?filters stays ONE endpoint: do not create /search, /sorted ...
//   - sort=salary (ascending) and sort=-salary (descending)
//   - pagination: page + limit, and send meta (total, pages) so the UI can draw page buttons
//   - route order: "/stats" must be declared BEFORE "/:id"
//
// CONCEPT: a list can be huge, so the client asks for exactly the slice it needs using the QUERY STRING
// (everything after "?"). The server filters first, then sorts, then cuts out one page.
// =====================================================================================
import express from "express";

const employees = [
  { id: 1, name: "Asha Verma", email: "asha@example.com", department: "IT", salary: 60000 },
  { id: 2, name: "Ravi Kumar", email: "ravi@example.com", department: "HR", salary: 45000 },
  { id: 3, name: "Meera Nair", email: "meera@example.com", department: "IT", salary: 85000 },
  { id: 4, name: "Kabir Singh", email: "kabir@example.com", department: "Finance", salary: 52000 },
  { id: 5, name: "Neha Gupta", email: "neha@example.com", department: "IT", salary: 70000 },
];

const app = express();
app.use(express.json()); // needed for the POST route at the bottom (fills req.body)

// Declared BEFORE any "/api/employees/:id" route. Express checks routes top to bottom; if :id came first,
// the URL /api/employees/stats would match it with id = "stats".
app.get("/api/employees/stats", (req, res) => {
  // Array.reduce(fn, start) walks the array carrying an "accumulator" (acc) and returns the final one.
  // Here acc is an object that groups employees by department: { IT: {...}, HR: {...} }.
  const groups = employees.reduce((acc, e) => {
    // `acc[key] ??= value` assigns the value only when acc[key] is still undefined (first time we see the department).
    const g = (acc[e.department] ??= { department: e.department, count: 0, total: 0 });
    g.count++; // one more employee in this department
    g.total += e.salary; // add the salary to the department total
    return acc; // reduce needs the accumulator returned each time
  }, {}); // {} is the starting accumulator

  // Object.values(obj) returns the values as an array; map() converts each group to the shape we send.
  const byDepartment = Object.values(groups).map((g) => ({ department: g.department, count: g.count, avgSalary: Math.round(g.total / g.count) }));
  res.json({ success: true, data: { total: employees.length, byDepartment } });
});

app.get("/api/employees", (req, res) => {
  const { search, department, sort } = req.query; // query values are strings (or undefined when not sent)

  // parseInt("2") -> 2, parseInt(undefined) -> NaN (falsy), so `|| 1` supplies the default.
  // Math.max(x, 1) never lets page go below 1. Math.min(x, 100) never lets limit go above 100,
  // so nobody can ask for a million rows.
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);

  let result = employees; // start with everything, then narrow it down step by step

  if (search) {
    const q = search.toLowerCase(); // lower-case both sides to ignore upper/lower case
    // Array.filter keeps elements that pass the test; String.includes checks for a substring.
    result = result.filter((e) => e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q));
  }
  if (department) result = result.filter((e) => e.department === department); // exact match

  if (sort) {
    // "-salary" means descending. startsWith("-") detects it; replace(/^-/, "") removes the leading minus
    // (the regex ^- means "a minus at the start") to get the field name.
    const dir = sort.startsWith("-") ? -1 : 1;
    const key = sort.replace(/^-/, "");
    // [...result] copies the array first, because sort() CHANGES the array it is called on.
    // The compare function returns a positive number, negative number or 0; multiplying by dir reverses the order.
    result = [...result].sort((a, b) => (a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0) * dir);
  }

  // PAGINATION: page 2 with limit 2 -> start = (2-1)*2 = 2 -> slice(2, 4) = the 3rd and 4th rows.
  const total = result.length; // total matching rows BEFORE cutting the page
  const start = (page - 1) * limit;
  res.json({
    success: true,
    data: result.slice(start, start + limit), // Array.slice(from, toExclusive) returns a copy of part of the array
    meta: { total, page, limit, pages: Math.ceil(total / limit) }, // ceil rounds up: 5 rows / 2 per page = 3 pages
  });
});

// POST: add an employee, then fetch the list again to see it appear in the search/sort/paging results.
// (No validation here on purpose, step 06 covers it.) The array is `const`, but push() changes its CONTENT,
// which is allowed; const only forbids assigning a different array.
app.post("/api/employees", (req, res) => {
  const emp = { id: employees.length + 1, ...req.body };
  employees.push(emp);
  res.status(201).json({ success: true, data: emp });
});

app.listen(5000, () => console.log("http://localhost:5000/api/employees"));
