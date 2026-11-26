import "dotenv/config"; // load .env first (this script runs on its own, not through server.js)
import mongoose from "mongoose"; // needed to disconnect at the end
import connectDB from "./config/db.js";
import User from "./models/User.js";
import Department from "./models/Department.js";
import Employee from "./models/Employee.js";

await connectDB(); // open the connection

const deptNames = ["IT", "HR", "Finance", "Operations"]; // departments to make sure exist
const depts = {}; // will map name -> department document
for (const name of deptNames) {
  // upsert: update the department if it exists, insert it if not; "after" returns the saved document (we need its _id)
  depts[name] = await Department.findOneAndUpdate({ name }, { name }, { upsert: true, returnDocument: "after" });
}

// The admin's credentials come from .env, never from source code.
const adminEmail = process.env.SEED_ADMIN_EMAIL;
const adminPassword = process.env.SEED_ADMIN_PASSWORD;
if (!adminEmail || !adminPassword) {
  console.error("Set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env first");
  process.exit(1); // stop with a failure code
}
// Create the admin only if it does not exist yet, so running the seed twice is safe.
// User.create (not insertMany) so the pre("save") hook hashes the password.
if (!(await User.findOne({ email: adminEmail }))) {
  await User.create({ name: "Admin", email: adminEmail, password: adminPassword, role: "admin" });
  console.log("Admin user created:", adminEmail);
}

// Insert sample employees only into an empty collection (again: safe to re-run).
if ((await Employee.countDocuments()) === 0) {
  await Employee.insertMany([
    // department: stores the ObjectId of the matching department document
    { name: "Asha Verma", email: "asha@iitk.ac.in", position: "Developer", salary: 60000, department: depts.IT._id },
    { name: "Ravi Kumar", email: "ravi@iitk.ac.in", position: "HR Executive", salary: 45000, department: depts.HR._id },
    { name: "Meera Nair", email: "meera@iitk.ac.in", position: "Tech Lead", salary: 85000, department: depts.IT._id },
    { name: "Karan Singh", email: "karan@iitk.ac.in", position: "Accountant", salary: 52000, department: depts.Finance._id },
    { name: "Sita Rao", email: "sita@iitk.ac.in", position: "Ops Manager", salary: 70000, department: depts.Operations._id },
  ]);
  console.log("Sample employees inserted");
}

await mongoose.disconnect(); // close the connection so the process can exit
console.log("Seed complete");
