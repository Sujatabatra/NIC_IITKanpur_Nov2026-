// =====================================================================================
// STEP 11 - Seed script: departments, an admin user and sample employees
// Run:  node steps/11-seed.js         (then restart step 10 and log in as the admin)
//
// WHAT YOU LEARN
//   - a seed script gives every developer the same starting data with one command
//   - it is IDEMPOTENT: running it twice does not create duplicates (upsert / exists-check / count-check)
//   - the first admin cannot come from the public register route, so the seed creates it
//   - the admin email and password are written in lib/config.js (real projects keep them in .env, never in code)
//   - open Compass afterwards: the password is a "$2a$12$..." hash and department is an ObjectId
// =====================================================================================

import { connect, disconnect } from "../lib/db.js"; // connection helpers
import { Department, Employee, User } from "../lib/models.js"; // all three models
import { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } from "../lib/config.js"; // written in lib/config.js

// Admin credentials: open lib/config.js to see (and change) them. A real project reads them from .env instead.
const adminEmail = SEED_ADMIN_EMAIL;
const adminPassword = SEED_ADMIN_PASSWORD;

await connect(); // open the connection

// 1) Departments: upsert = update if it exists, insert if it does not.
const depts = {}; // will map name -> department document, e.g. depts.IT
for (const name of ["IT", "HR", "Finance", "Operations"]) {
  // find a department with this name; set name to the same value; upsert:true creates it when missing;
  // returnDocument:"after" returns the saved document so we can read its _id later.
  depts[name] = await Department.findOneAndUpdate({ name }, { name }, { upsert: true, returnDocument: "after" });
}

// 2) Admin: use create() (NOT insertMany/updateOne) so pre("save") hashes the password.
if (!(await User.findOne({ email: adminEmail }))) {
  // no admin yet -> create one with role "admin" (the only place a role can be chosen)
  await User.create({ name: "Admin", email: adminEmail, password: adminPassword, role: "admin" });
  console.log("Admin user created:", adminEmail);
} else {
  // running the seed again must not fail or duplicate
  console.log("Admin already exists:", adminEmail);
}

// 3) Employees: only when the collection is empty.
if ((await Employee.countDocuments()) === 0) {
  const d = (n) => depts[n]._id; // tiny helper: department name -> its ObjectId
  // insertMany saves all five in one call (it also runs schema validation)
  await Employee.insertMany([
    { name: "Asha Verma", email: "asha@example.com", position: "Developer", salary: 60000, department: d("IT") },
    { name: "Ravi Kumar", email: "ravi@example.com", position: "HR Executive", salary: 45000, department: d("HR") },
    { name: "Meera Nair", email: "meera@example.com", position: "Tech Lead", salary: 85000, department: d("IT") },
    { name: "Karan Singh", email: "karan@example.com", position: "Accountant", salary: 52000, department: d("Finance") },
    { name: "Sita Rao", email: "sita@example.com", position: "Ops Manager", salary: 70000, department: d("Operations") },
  ]);
  console.log("Sample employees inserted");
}

// Print how many documents each collection now holds.
console.log("Seed complete:", {
  departments: await Department.countDocuments(),
  users: await User.countDocuments(),
  employees: await Employee.countDocuments(),
});
await disconnect(); // close connection so the script exits

// TRY IT: run it twice. Counts do not change.
// NEXT: this is the finished project: ../../backend (layered folders, validation, rate limiting, Swagger) does the same
//       things in separate files. Compare its src/ folder with steps 07 + 10.
