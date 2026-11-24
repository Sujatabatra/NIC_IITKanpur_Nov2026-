// =====================================================================================
// STEP 12 - Form validation and reset
//
// Before saving, CHECK the data. Collect problems in an `errors` object (field -> message),
// show each message next to its field, and only save when there are no errors.
// After a successful save, put the form back to its starting values ("reset").
// =====================================================================================

import { useState } from "react";

export const meta = {
  title: "Validation and reset",
  concept: "Validate before saving, show errors next to the fields, and clear the form after success.",
  newInThisStep: [
    "A second state object for errors: { name: 'Name is required', ... }",
    "validate() builds the errors, stores them and returns true/false",
    "Show an error only when it exists: {errors.name && <small>...</small>}",
    "Reset the form by restoring the initial values",
  ],
  tryThis: [
    "Submit an empty form to see all three errors",
    "Enter an invalid email (no @) and submit",
    "Add a rule: name must be at least 3 characters",
  ],
};

// The starting values, kept in one constant so we can reuse them for the initial state AND for reset.
const empty = { name: "", email: "", salary: "" };

export default function Demo() {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({}); // NEW: e.g. { name: "Name is required" }
  const [saved, setSaved] = useState([]); // records that passed validation

  // Same one-handler-for-all-fields pattern as step 11
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // NEW: validation.
  // Build a fresh errors object: add a key only for fields that are wrong.
  //   .trim() removes spaces so "   " counts as empty.
  //   /^\S+@\S+\.\S+$/ is a simple email pattern: some text, @, some text, a dot, some text.
  // Return true when there are NO errors (Object.keys(e).length === 0).
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.salary || Number(form.salary) <= 0) e.salary = "Salary must be a positive number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return; // invalid: stop here, the errors are now shown
    setSaved((list) => [...list, { ...form, salary: Number(form.salary) }]); // add a copy to the saved list
    setForm(empty); // NEW: reset all fields
    setErrors({}); // and clear old error messages
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 6, maxWidth: 340 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        {/* The error text appears only if errors.name exists (the && pattern from step 06) */}
        {errors.name && <small className="err">{errors.name}</small>}

        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        {errors.email && <small className="err">{errors.email}</small>}

        <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} />
        {errors.salary && <small className="err">{errors.salary}</small>}

        <div>
          <button type="submit">Save</button>
          {/* type="button" so it does NOT submit the form */}
          <button
            type="button"
            onClick={() => {
              setForm(empty);
              setErrors({});
            }}
          >
            Reset
          </button>
        </div>
      </form>
      <h4>Saved ({saved.length})</h4>
      <pre>{JSON.stringify(saved, null, 2)}</pre>
    </div>
  );
}
