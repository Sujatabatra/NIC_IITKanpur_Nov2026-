import { useEffect, useState } from "react"; // state for the fields, effect to load departments
import api from "../lib/api.js"; // HTTP client

// One form used by BOTH the "new" and the "edit" page. The page supplies `initial` values and what to do on submit.
export default function EmployeeForm({ initial, onSubmit, submitLabel = "Save" }) { // props: initial data, submit callback, button text
  // One state object for all fields. The spread at the end lets `initial` (edit page) override the empty defaults.
  const [form, setForm] = useState({ name: "", email: "", position: "", salary: "", department: "", status: "active", ...initial });
  const [departments, setDepartments] = useState([]); // options for the department <select>
  const [error, setError] = useState(null); // the normalised error object from api.js, or null
  const [saving, setSaving] = useState(false); // true while the request is running (disables the button)

  useEffect(() => { // load the department list once when the form appears
    api.get("/departments").then((r) => setDepartments(r.data.data)); // the backend wraps the array as { success, data }
  }, []); // [] = only on mount

  // One handler for every input: the input's `name` attribute is the key in the form object.
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value })); // copy old values, replace just one key

  const handleSubmit = async (e) => { // runs when the form is submitted
    e.preventDefault(); // stop the browser's default full-page form submit
    setError(null); // clear the previous error
    setSaving(true); // show "Saving..." and disable the button
    try { // try the request
      await onSubmit({ ...form, salary: Number(form.salary) }); // inputs give strings; the API expects a number for salary
    } catch (err) { // the page's onSubmit (an API call) failed
      setError(err); // show the message (and field errors) to the user
      setSaving(false); // allow another attempt. On success we do NOT reset: the page navigates away.
    }
  };

  return ( // the form UI
    <form className="stack" onSubmit={handleSubmit}>
      {/* controlled input: its value comes from state, and every keystroke updates state through onChange */}
      <input name="name" placeholder="Full name" required value={form.name} onChange={handleChange} />
      {/* type="email" gives free browser validation */}
      <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
      {/* job title */}
      <input name="position" placeholder="Position" required value={form.position} onChange={handleChange} />
      {/* type="number" shows a numeric keypad; min="1" matches the backend rule salary > 0 */}
      <input name="salary" type="number" min="1" placeholder="Salary" required value={form.salary} onChange={handleChange} />
      {/* the select's value is the department _id, which is what the backend stores */}
      <select name="department" required value={form.department} onChange={handleChange}>
        {/* empty first option: "required" then forces a real choice */}
        <option value="">Select department</option>
        {/* turn the array of departments into <option> elements; key helps React track list items */}
        {departments.map((d) => (
          <option key={d._id} value={d._id}>
            {d.name}
          </option>
        ))}
      </select>
      {/* status can only be one of two values on the backend */}
      <select name="status" value={form.status} onChange={handleChange}>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      {/* show errors only when there is one */}
      {error && (
        <div className="error">
          {/* the general message, e.g. "Validation failed" or "Email already registered" */}
          {error.message}
          {/* field-by-field problems from express-validator; ?. because errors may be undefined */}
          <ul>
            {error.errors?.map((x, i) => (
              <li key={i}>
                {x.field}: {x.message}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* disabled while saving prevents double submits */}
      <button className="btn" disabled={saving}>
        {saving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
