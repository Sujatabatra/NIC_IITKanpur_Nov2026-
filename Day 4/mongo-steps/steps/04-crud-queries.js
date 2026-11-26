// =====================================================================================
// STEP 04 - CRUD, filters, search, sorting and pagination with the Mongoose model
// Run:  node steps/04-crud-queries.js
//
// WHAT YOU LEARN
//   - create / find / findById / findByIdAndUpdate / findByIdAndDelete
//   - update options: returnDocument "after" (give me the NEW document) and runValidators
//   - building a filter object dynamically, regex search, escapeRegex for safety
//   - sort + skip + limit, and countDocuments to compute the number of pages
// =====================================================================================

// Mongoose library.
import mongoose from "mongoose";
// connect/disconnect helpers.
import { connect, disconnect } from "../lib/db.js";

// Define the model in one expression: name "Step4Person" -> collection "step4people"/"step4persons".
const Person = mongoose.model(
  "Step4Person",
  new mongoose.Schema({
    name: { type: String, required: true }, // required text
    position: String, // shorthand: just a type, no rules
    department: String, // plain text department (a reference comes in step 05)
    salary: { type: Number, min: 0 }, // number, not negative
  })
);

await connect(); // open the connection
await Person.deleteMany({}); // start from an empty collection

// CREATE many at once
// insertMany validates each item and stores them all in one round trip.
await Person.insertMany([
  { name: "Asha Verma", position: "Developer", department: "IT", salary: 60000 },
  { name: "Ravi Kumar", position: "HR Executive", department: "HR", salary: 45000 },
  { name: "Meera Nair", position: "Tech Lead", department: "IT", salary: 85000 },
  { name: "Karan Singh", position: "Accountant", department: "Finance", salary: 52000 },
  { name: "Sita Rao", position: "Ops Manager", department: "Operations", salary: 70000 },
  { name: "Arjun Das", position: "Developer", department: "IT", salary: 58000 },
]);

// READ one by id. ids are ObjectId values; Mongoose also accepts the 24-char string.
// findOne returns the first document that matches; /asha/i is a case-insensitive regular expression.
const asha = await Person.findOne({ name: /asha/i });
// String(asha._id) converts the ObjectId to its 24-character text form for printing.
console.log("findOne:", asha.name, "| id:", String(asha._id));
// findById is shorthand for findOne({ _id: id }).
console.log("findById:", (await Person.findById(asha._id)).position);

// UPDATE: by default you get the OLD document back. returnDocument:"after" returns the new one.
// runValidators:true applies the schema rules to the update too (OFF by default for updates!).
// $inc adds 5000 to the current salary.
const raised = await Person.findByIdAndUpdate(asha._id, { $inc: { salary: 5000 } }, { returnDocument: "after", runValidators: true });
console.log("new salary:", raised.salary);

// Without runValidators this bad update would be saved silently. With it, it throws.
try {
  await Person.findByIdAndUpdate(asha._id, { salary: -1 }, { runValidators: true }); // -1 breaks min: 0
} catch (err) {
  console.log("update rejected:", err.message); // the readable validation message
}

// ---------- the same shape as GET /api/employees?search=&department=&sort=&page=&limit= ----------
// Escape every character that has a special meaning in a regex by putting a backslash before it.
// "$&" in the replacement means "the matched character". "a.b" must match literally, not "a any-char b".
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Function with an options object; each option has a default (sort newest-high first, page 1, 2 per page).
async function list({ search, department, sort = "-salary", page = 1, limit = 2 }) {
  const filter = {}; // the MongoDB filter we build up step by step
  if (department) filter.department = department; // add an exact-match condition only when it was supplied
  if (search) {
    // Build a case-insensitive regex from the SAFE (escaped) search text.
    const rx = new RegExp(escapeRegex(search), "i"); // "i" = case-insensitive
    filter.$or = [{ name: rx }, { position: rx }]; // match name OR position
  }
  // "-salary" -> { salary: -1 } (descending); "name" -> { name: 1 } (ascending).
  // replace(/^-/, "") removes a leading "-"; [expr]: computed property name.
  const sortBy = { [sort.replace(/^-/, "")]: sort.startsWith("-") ? -1 : 1 };

  // Two independent queries: run them at the same time.
  // Promise.all waits for both and returns their results as an array, which we destructure.
  const [items, total] = await Promise.all([
    // skip the items of earlier pages, then take `limit` items
    Person.find(filter).sort(sortBy).skip((page - 1) * limit).limit(limit),
    Person.countDocuments(filter), // count of ALL matches, not just this page
  ]);
  // Return a small summary: printable names, how many matched in total, how many pages exist (round up).
  return { items: items.map((p) => `${p.name} (${p.salary})`), total, pages: Math.ceil(total / limit) };
}

console.log("\nIT only, page 1:", await list({ department: "IT" })); // top 2 IT salaries
console.log("IT only, page 2:", await list({ department: "IT", page: 2 })); // the 3rd IT person
console.log("search 'dev':   ", await list({ search: "dev" })); // matches position "Developer"
console.log("by name asc:    ", await list({ sort: "name", limit: 3 })); // alphabetical, 3 per page

// DELETE
// Remove Asha by id (returns the deleted document or null).
await Person.findByIdAndDelete(asha._id);
console.log("\nleft after delete:", await Person.countDocuments());

// NO cleanup: the remaining people stay in MongoDB so you can look at them in Compass (collection step4people).
await disconnect(); // close connection

// TRY IT: search for "a.b" with and without escapeRegex.
// TRY IT: add a ?minSalary filter:  filter.salary = { $gte: Number(minSalary) }
