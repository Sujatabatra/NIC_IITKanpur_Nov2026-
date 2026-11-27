"use client";
// components/EmployeeForm.js - ONE form reused by the "new" page and the "edit" page.
//
// REACT LESSONS:
//   * PROPS: inputs to a component, like function arguments. `initial` pre-fills the form (edit),
//     `onSubmit` is a FUNCTION passed down by the parent (the form does not know whether it creates or
//     updates: the parent decides), `submitLabel` has a default value.
//   * CONTROLLED INPUTS: the input shows `value={form.name}` and reports changes with onChange, so React
//     state is the single source of truth for what is typed.
//   * ONE handleChange for many fields: each input has a `name`; `[e.target.name]: value` is a
//     "computed property" that updates the matching key.
//   * IMMUTABLE UPDATES: never modify state directly (form.name = "x"). Create a copy with the spread
//     operator { ...old, name: "x" } so React notices the change.
//   * LISTS need a stable `key`: React uses it to track which item is which when the list changes.
import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function EmployeeForm({ initial, onSubmit, submitLabel = "Save" }) {
  // Start with empty defaults, then overlay `initial` (spread of undefined is harmless).
  const [form, setForm] = useState({ name: "", email: "", position: "", salary: "", department: "", status: "active", ...initial });
  const [departments, setDepartments] = useState([]); // options for the <select>
  const [error, setError] = useState(null); // {message, errors[]} from the backend
  const [saving, setSaving] = useState(false); // disables the button while the request runs

  // Load the department list once, when the form first appears.
  useEffect(() => {
    api.get("/departments").then((r) => setDepartments(r.data.data));
  }, []);

  // Functional update `(p) => ...` receives the latest state, which is the safe way when the new value depends on the old one.
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop the browser's default "reload the page" form submit
    setError(null);
    setSaving(true);
    try {
      // Inputs always give strings; the API expects a number for salary.
      await onSubmit({ ...form, salary: Number(form.salary) });
    } catch (err) {
      setError(err); // show the backend's validation messages
      setSaving(false); // on success the parent navigates away, so we only reset on failure
    }
  };

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <input name="name" placeholder="Full name" required value={form.name} onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
      <input name="position" placeholder="Position" required value={form.position} onChange={handleChange} />
      <input name="salary" type="number" min="1" placeholder="Salary" required value={form.salary} onChange={handleChange} />
      <select name="department" required value={form.department} onChange={handleChange}>
        <option value="">Select department</option>
        {/* map turns an array of data into an array of elements; key = a unique, stable id */}
        {departments.map((d) => (
          <option key={d._id} value={d._id}>
            {d.name}
          </option>
        ))}
      </select>
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      {error && (
        <div className="error">
          {error.message}
          <ul>
            {/* `?.` = optional chaining: skip .map when `errors` is undefined */}
            {error.errors?.map((x, i) => (
              <li key={i}>
                {x.field}: {x.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button className="btn" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
