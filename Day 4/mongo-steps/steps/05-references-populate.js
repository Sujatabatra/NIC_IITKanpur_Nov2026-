// =====================================================================================
// STEP 05 - References between collections and populate()
// Run:  node steps/05-references-populate.js
//
// WHAT YOU LEARN
//   - an Employee stores the department's _id (a reference), not a copy of the department
//   - populate("department") swaps that id for the real document when you read
//   - why reference: rename "IT" once and every employee shows the new name
//   - the models now live in lib/models.js (Department, Employee, User)
// =====================================================================================

// connect/disconnect helpers.
import { connect, disconnect } from "../lib/db.js";
// The shared models defined in lib/models.js.
import { Department, Employee } from "../lib/models.js";

await connect(); // open connection
await Employee.deleteMany({}); // empty both collections so the script can be re-run
await Department.deleteMany({});
await Employee.init(); // make sure the unique indexes exist

// create() with one object saves one document and returns it (with its generated _id).
const it = await Department.create({ name: "IT" });
const hr = await Department.create({ name: "HR" });

// create() with an ARRAY saves several documents.
await Employee.create([
  // department: it._id -> we store only the id of the IT department document.
  { name: "Asha Verma", email: "asha@example.com", position: "Developer", salary: 60000, department: it._id },
  { name: "Ravi Kumar", email: "ravi@example.com", position: "HR Executive", salary: 45000, department: hr._id },
]);

// Without populate: the department is only an id.
const raw = await Employee.findOne({ name: /asha/i });
console.log("raw department field:", raw.department); // prints an ObjectId

// With populate: the id is replaced by the document. The 2nd argument picks fields ("name").
const full = await Employee.findOne({ name: /asha/i }).populate("department", "name");
console.log("populated:", full.department); // { _id, name: "IT" }
// JSON.stringify shows what an API response would contain (the department is nested inside).
console.log("as JSON:", JSON.stringify(full));

// Why a reference? Rename once...
// findByIdAndUpdate changes the single Department document.
await Department.findByIdAndUpdate(it._id, { name: "Information Technology" });
// ...and every employee sees it, because they only stored the id.
console.log("after rename:", (await Employee.findOne({ name: /asha/i }).populate("department", "name")).department.name);

// A reference to something that does not exist is NOT checked by MongoDB. Your code must handle it.
// The id below is a valid-looking ObjectId (24 hex characters) that no department has.
const ghost = await Employee.create({ name: "Ghost", email: "g@example.com", position: "?", salary: 1, department: "64b000000000000000000000" });
// populate finds nothing to join, so department becomes null.
console.log("dangling department populates to:", (await Employee.findById(ghost._id).populate("department")).department);

// Query BY the reference:
// filter on the stored id, then .map() turns the found employees into just their names.
console.log("people in HR:", (await Employee.find({ department: hr._id })).map((e) => e.name));

// NO cleanup: look at the data in Compass. In `employees`, department is an id; compare it with `departments`.
await disconnect(); // close connection

// TRY IT: when would you EMBED instead? (data read together, owned by one parent, small and bounded: e.g. an address.)
