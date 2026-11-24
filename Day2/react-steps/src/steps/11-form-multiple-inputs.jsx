// =====================================================================================
// STEP 11 - A form with several inputs and onSubmit
//
// For a real form keep ALL the fields in ONE state object and write ONE onChange handler that
// works for every input. It finds the right field using the input's `name` attribute.
// =====================================================================================

import { useState } from "react";

export const meta = {
  title: "Form with multiple inputs",
  concept: "Keep the whole form in one state object and update it with a single handler.",
  newInThisStep: [
    "One state object: { name, email, department, salary }",
    "One handler for every field using the input's name attribute: [name]: value",
    "setForm(prev => ({ ...prev, [name]: value })) copies the old values and changes one",
    "onSubmit + e.preventDefault() to handle the form without a page reload",
  ],
  tryThis: [
    "Fill the form and press Add; read the submitted object under the form",
    "Add a 'city' input and handle it WITHOUT writing another handler",
    "Remove e.preventDefault() and see the page reload",
  ],
};

export default function Demo() {
  // One object holds every field. Inputs are strings, so salary starts as "" (not 0).
  const [form, setForm] = useState({ name: "", email: "", department: "IT", salary: "" });
  const [submitted, setSubmitted] = useState(null); // remembers what was submitted, to display it

  // NEW: ONE handler for ALL inputs.
  //   e.target is the input that changed. Its `name` attribute ("email") and `value` (typed text)
  //   tell us which field to update.
  //   [name]: value is a COMPUTED KEY: the key comes from the variable's value.
  //   ...prev copies the old fields first (JS step 06), so only the changed one is replaced.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // do not reload the page
    // Inputs always give strings, so convert salary to a number before saving.
    setSubmitted({ ...form, salary: Number(form.salary) });
  };

  return (
    <div>
      {/* onSubmit fires when the user presses the submit button OR hits Enter in a field */}
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8, maxWidth: 340 }}>
        {/* Each input: name (which field), value (from state), onChange (the shared handler) */}
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        {/* <select> is controlled the same way as an input */}
        <select name="department" value={form.department} onChange={handleChange}>
          <option>IT</option>
          <option>HR</option>
          <option>Finance</option>
        </select>
        <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} />
        <button type="submit">Add</button>
      </form>

      {/* JSON.stringify(value, null, 2) prints an object as indented text: handy for seeing state */}
      <h4>Live form state</h4>
      <pre>{JSON.stringify(form, null, 2)}</pre>
      <h4>Submitted</h4>
      <pre>{submitted ? JSON.stringify(submitted, null, 2) : "nothing yet"}</pre>
    </div>
  );
}
