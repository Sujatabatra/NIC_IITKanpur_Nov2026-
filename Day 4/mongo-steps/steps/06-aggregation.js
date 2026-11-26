// =====================================================================================
// STEP 06 - Aggregation pipeline: group, join, shape the answer inside the database
// Run:  node steps/06-aggregation.js
//
// WHAT YOU LEARN
//   - a pipeline = an array of stages; each stage transforms the documents and hands them to the next
//   - $group (count, sum, avg), $lookup (a join), $unwind, $project, $sort, $match
//   - this is the query behind the Day 5 dashboard (GET /api/employees/stats)
// =====================================================================================

// connect/disconnect helpers and the shared models.
import { connect, disconnect } from "../lib/db.js";
import { Department, Employee } from "../lib/models.js";

await connect(); // open connection
await Employee.deleteMany({}); // start from empty collections
await Department.deleteMany({});
await Employee.init(); // build unique indexes

// Create three departments in one call and destructure the returned array into three variables.
const [it, hr, fin] = await Department.create([{ name: "IT" }, { name: "HR" }, { name: "Finance" }]);
// Small helper that builds an employee object: email is made from the name; d = the department document.
const mk = (name, salary, d) => ({ name, email: `${name.toLowerCase()}@example.com`, position: "Staff", salary, department: d._id });
// Three IT people, one HR, one Finance.
await Employee.create([mk("Asha", 60000, it), mk("Meera", 85000, it), mk("Arjun", 58000, it), mk("Ravi", 45000, hr), mk("Karan", 52000, fin)]);

// 1) One group over EVERYTHING: _id: null means "a single bucket".
// Destructure the first (only) result out of the array.
const [totals] = await Employee.aggregate([
  // $sum: 1 adds 1 per document (= count); $avg averages a field; "$salary" means "the value of the salary field".
  { $group: { _id: null, total: { $sum: 1 }, avgSalary: { $avg: "$salary" }, totalSalary: { $sum: "$salary" } } },
]);
console.log("totals:", totals);

// 2) Per department. Read the stages top to bottom: each one feeds the next.
const byDepartment = await Employee.aggregate([
  // Stage 1: one bucket per department id; count people and average their salary.
  { $group: { _id: "$department", count: { $sum: 1 }, avgSalary: { $avg: "$salary" } } }, // "$field" = value of that field
  // Stage 2: JOIN. For each bucket, find the department whose _id equals the bucket's _id; put matches in `dept` (an array).
  { $lookup: { from: "departments", localField: "_id", foreignField: "_id", as: "dept" } }, // JOIN: dept becomes an array
  // Stage 3: turn the one-element array into a single object (one output document per array item).
  { $unwind: "$dept" }, // array of one -> plain object
  // Stage 4: choose the output fields. _id: 0 hides the id; 1 keeps a field; "$dept.name" renames; $round rounds to 0 decimals.
  { $project: { _id: 0, department: "$dept.name", count: 1, avgSalary: { $round: ["$avgSalary", 0] } } }, // shape the output
  // Stage 5: biggest departments first.
  { $sort: { count: -1 } },
]);
console.table(byDepartment); // prints the array as a table

// 3) $match first = filter before grouping (cheaper, can use an index).
const wellPaid = await Employee.aggregate([
  { $match: { salary: { $gte: 55000 } } }, // keep only salaries >= 55000
  { $group: { _id: "$department", count: { $sum: 1 } } }, // then count them per department
]);
console.log("salary >= 55000, grouped:", wellPaid.length, "department(s)"); // number of buckets

// NO cleanup: the data stays so you can inspect it in Compass (and run the pipeline above in Compass's Aggregations tab).
await disconnect(); // close connection

// TRY IT: add { $sort: { avgSalary: -1 } } and { $limit: 1 } to find the best-paying department.
// TRY IT: remove $unwind and print the result to see why it is needed.
