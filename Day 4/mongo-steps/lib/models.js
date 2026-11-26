// The three models of the course, used from step 05 on. Steps 03-04 build Employee by hand first.

// The mongoose library: Schema/model/models are pulled out of it below.
import mongoose from "mongoose";
// bcryptjs: pure-JavaScript bcrypt, used to hash passwords.
import bcrypt from "bcryptjs";

// Destructuring: take three properties out of `mongoose` into local variables.
//   Schema = class that describes a document's shape; model = function that creates a Model;
//   models = registry of the models already created in this process.
const { Schema, model, models } = mongoose;

// ---------------------------------- Department ----------------------------------
// Describe a department document. 1st argument = fields, 2nd argument = options.
const departmentSchema = new Schema(
  // name: must be text, must be present, must be unique (creates a unique index), spaces at the ends are cut.
  { name: { type: String, required: true, unique: true, trim: true } },
  // timestamps: true -> Mongoose adds and maintains createdAt and updatedAt.
  { timestamps: true }
);

// ---------------------------------- Employee ----------------------------------
const employeeSchema = new Schema(
  {
    // name: text; required with a custom error message [rule, message]; trimmed; at most 100 characters.
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 100 },
    // email: text, required, unique index, forced to lower case so "A@x.com" and "a@x.com" are the same, trimmed.
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // position: required text such as "Developer".
    position: { type: String, required: true, trim: true },
    // salary: required number that cannot be negative.
    salary: { type: Number, required: true, min: 0 },
    // department: stores only the _id (ObjectId) of a Department document.
    // `ref` tells populate() which model to fetch it from. This is a REFERENCE, not a copy.
    department: { type: Schema.Types.ObjectId, ref: "Department", required: true },
    // status: only "active" or "inactive" are allowed; if not supplied it becomes "active".
    status: { type: String, enum: ["active", "inactive"], default: "active" },
  },
  { timestamps: true } // createdAt / updatedAt again
);
// Compound index: 1 = ascending department, -1 = descending salary. It speeds up
// "filter by department, sort by salary" queries.
employeeSchema.index({ department: 1, salary: -1 });

// ---------------------------------- User ----------------------------------
const userSchema = new Schema(
  {
    // name: required text, trimmed.
    name: { type: String, required: true, trim: true },
    // email: the login id; unique so two users cannot share it; lower-cased.
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // password: at least 8 characters. select:false = queries do NOT return this field unless asked with .select("+password"),
    // so the hash cannot leak by accident.
    password: { type: String, required: true, minlength: 8, select: false },
    // role: decides what the user may do. New users are "user".
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

// pre("save") = middleware that runs automatically BEFORE a document is saved.
// A normal `function` (not an arrow) is required here, because we need `this` = the document being saved.
userSchema.pre("save", async function () {
  // If the password was not changed (e.g. only the name was edited), do nothing: never hash a hash.
  if (!this.isModified("password")) return;
  // Replace the plain password by its bcrypt hash. 12 = cost factor (how slow/strong the hashing is).
  this.password = await bcrypt.hash(this.password, 12);
});
// Add a method to every User document: user.matchPassword("typed password").
// bcrypt.compare hashes the typed text with the salt stored inside the saved hash and checks they match (true/false).
userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

// Create the models. `models.X ||` re-uses an existing model if this file is loaded twice
// (creating the same model twice throws OverwriteModelError). Mongoose derives the collection name
// from the model name: "Department" -> departments, "Employee" -> employees, "User" -> users.
export const Department = models.Department || model("Department", departmentSchema);
export const Employee = models.Employee || model("Employee", employeeSchema);
export const User = models.User || model("User", userSchema);
