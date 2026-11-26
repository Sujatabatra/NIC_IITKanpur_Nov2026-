// =====================================================================================
// STEP 03 - Schema, Model and validation
// Run:  node steps/03-schema-validation.js
//
// WHAT YOU LEARN
//   - Schema = the shape and the rules of a document. Model = the handle that talks to ONE collection
//   - types, required, trim, lowercase, min/max, enum, default, custom validators
//   - validation runs BEFORE saving and produces readable messages (these become API 400 errors)
//   - unique is not a validator: it is an INDEX, so the database rejects the duplicate (error 11000)
//   - timestamps: true adds createdAt / updatedAt for free
// =====================================================================================

// The Mongoose library (we need mongoose.Schema and mongoose.model).
import mongoose from "mongoose";
// Our connect/disconnect helpers.
import { connect, disconnect } from "../lib/db.js";

// Describe what an employee document must look like.
const employeeSchema = new mongoose.Schema(
  {
    // name: text, required (with our own error message), spaces trimmed, at most 100 characters.
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 100 },
    email: {
      type: String, // must be text
      required: [true, "Email is required"], // must be present; otherwise this message is reported
      unique: true, // creates a unique INDEX: the database refuses a second document with the same email
      lowercase: true, // "ASHA@X.COM" is stored as "asha@x.com"
      trim: true, // remove leading/trailing spaces
      match: [/^\S+@\S+\.\S+$/, "Invalid email"], // regex: non-space chars, "@", non-space chars, ".", non-space chars
    },
    // salary: number, required, minimum 0 (with a custom message for the minimum rule).
    salary: { type: Number, required: true, min: [0, "Salary cannot be negative"] },
    // status: must be one of the listed words; if omitted it defaults to "active".
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true } // second argument = options: add createdAt and updatedAt automatically
);

// Compile the schema into a Model. The 1st argument is the model name; Mongoose lower-cases and pluralises it:
// "Step3Employee" -> collection "step3employees".
const Employee = mongoose.model("Step3Employee", employeeSchema);

// Open the connection and wait for it.
await connect();
// Empty the collection so the script can be re-run.
await Employee.deleteMany({});
// Make sure the unique index exists before inserting (indexes are built in the background otherwise).
// matters in a script, not in a long-running server
await Employee.init();

// 1) A good document. Notice: spaces trimmed, email lower-cased, status defaulted, timestamps added.
// create() validates, then saves, then returns the saved document.
const ok = await Employee.create({ name: "  Asha Verma ", email: "ASHA@EXAMPLE.COM", salary: 60000 });
// toObject() turns the Mongoose document into a plain JavaScript object for printing.
console.log("created:", ok.toObject());

// 2) Bad data: every broken rule is reported, nothing is written.
try {
  // empty name, malformed email, negative salary, status not in the enum: four problems at once.
  await Employee.create({ name: "", email: "not-an-email", salary: -5, status: "retired" });
} catch (err) {
  // err.name is "ValidationError"; err.errors is an object with one entry per failing field.
  console.log("\nValidation failed:", err.name);
  // Object.entries gives [fieldName, errorObject] pairs; print each field with its message.
  for (const [field, e] of Object.entries(err.errors)) console.log(` - ${field}: ${e.message}`);
}

// 3) Duplicate email: passes validation, but the unique INDEX refuses it.
try {
  // same email as the first document (stored lower-case)
  await Employee.create({ name: "Other", email: "asha@example.com", salary: 1 });
} catch (err) {
  // err.code 11000 = MongoDB "duplicate key"; err.keyValue says which field/value clashed.
  console.log("\nDuplicate:", err.code, JSON.stringify(err.keyValue)); // 11000 -> we map it to HTTP 409 later
}

// NO cleanup: the document stays in MongoDB so you can look at it in Compass (database mern_steps, collection step3employees).
// Close the connection.
await disconnect();

// TRY IT: add `department: { type: String, required: true }` and watch the new message appear.
// TRY IT: add a custom validator:  validate: { validator: Number.isInteger, message: "Salary must be a whole number" }
