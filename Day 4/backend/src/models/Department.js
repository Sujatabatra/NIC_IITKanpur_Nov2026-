// Mongoose library.
import mongoose from "mongoose";

// The shape and rules of a department document.
const departmentSchema = new mongoose.Schema(
  {
    // name: required (custom message), unique (creates a unique index), spaces trimmed.
    name: { type: String, required: [true, "Department name is required"], unique: true, trim: true },
    // description: optional text, defaults to an empty string.
    description: { type: String, trim: true, default: "" },
  },
  { timestamps: true } // adds createdAt and updatedAt automatically
);

// Compile the schema into a model bound to the "departments" collection and export it.
export default mongoose.model("Department", departmentSchema);
