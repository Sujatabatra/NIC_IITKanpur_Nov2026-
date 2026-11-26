// Mongoose library.
import mongoose from "mongoose";

// The shape and rules of an employee document.
const employeeSchema = new mongoose.Schema(
  {
    // name: required text, trimmed, max 100 characters.
    name: { type: String, required: [true, "Name is required"], trim: true, maxlength: 100 },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true, // unique index: the database rejects a duplicate email (error 11000)
      lowercase: true, // store in lower case so "A@x.com" equals "a@x.com"
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"], // simple format check: something@something.something
    },
    // position: required job title.
    position: { type: String, required: [true, "Position is required"], trim: true },
    salary: {
      type: Number,
      required: [true, "Salary is required"],
      min: [0, "Salary cannot be negative"],
      validate: { validator: Number.isFinite, message: "Salary must be a number" }, // custom validation: rejects NaN and Infinity
    },
    // department: holds only the _id of a Department document; populate("department") fetches the real one.
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true }, // reference
    // status: restricted to two values, "active" unless told otherwise.
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    // joiningDate: defaults to the moment of creation (Date.now is passed as a function so it runs per document).
    joiningDate: { type: Date, default: Date.now },
  },
  { timestamps: true } // createdAt / updatedAt
);

employeeSchema.index({ department: 1, salary: -1 }); // compound index for filter + sort (department asc, salary desc)
employeeSchema.index({ name: 1 }); // index so sorting/searching by name is fast

// Compile and export the model ("employees" collection).
export default mongoose.model("Employee", employeeSchema);
