// =====================================================================================
// STEP 15 - One form for both "add" and "edit"
//
// Reuse the same form for creating and editing. We add ONE more piece of state, `editing`:
//   null          -> "add mode" (empty form)
//   an employee   -> "edit mode" (form is filled with that employee)
// The submit handler checks `editing` to decide whether to update or to add.
// =====================================================================================

// useEffect runs code AFTER React has updated the screen, and re-runs it when chosen values change.
import { useEffect, useState } from "react";

export const meta = {
  title: "Edit mode (form reuse)",
  concept: "Remember which record is being edited, load it into the form, and save it back with the same handler.",
  newInThisStep: [
    "editing state: null (add mode) or the employee being edited",
    "useEffect(() => { setForm(editing ?? empty) }, [editing]) copies the record into the form when Edit is clicked",
    "Submit handler branches: update when editing, add otherwise",
    "Cancel button leaves edit mode",
  ],
  tryThis: [
    "Click Edit on a row, change the salary and press Update",
    "Press Cancel in the middle of an edit",
    "Why do we need useEffect here? (the form's state is created once, but the 'editing' value changes)",
  ],
};

const empty = { name: "", department: "IT", salary: "" };

export default function Demo() {
  const [employees, setEmployees] = useState([
    { id: 1, name: "Asha", department: "IT", salary: 60000 },
    { id: 2, name: "Ravi", department: "HR", salary: 45000 },
  ]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null); // NEW: null = add mode, object = edit mode

  // NEW: useEffect(function, [dependencies]).
  // The function runs after the first render and again whenever a value in the dependency array changes.
  // Here: when `editing` changes (Edit clicked, or Cancel/Update clears it), copy it into the form.
  //   editing ?? empty  ->  use `editing` if it exists, otherwise `empty` (?? = "if null or undefined")
  useEffect(() => {
    setForm(editing ?? empty);
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.salary) return;
    const data = { name: form.name, department: form.department, salary: Number(form.salary) };

    if (editing) {
      // EDIT MODE: replace the matching employee with a merged copy (step 14 pattern)
      setEmployees((list) => list.map((emp) => (emp.id === editing.id ? { ...emp, ...data } : emp)));
      setEditing(null); // leave edit mode (the effect above then resets the form)
    } else {
      // ADD MODE: step 13 pattern
      setEmployees((list) => [...list, { ...data, id: Date.now() }]);
      setForm(empty);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <select name="department" value={form.department} onChange={handleChange}>
          <option>IT</option>
          <option>HR</option>
          <option>Finance</option>
        </select>
        <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} />
        {/* The button label follows the mode */}
        <button type="submit">{editing ? "Update" : "Add"}</button>
        {/* Cancel is shown only in edit mode */}
        {editing && (
          <button type="button" onClick={() => setEditing(null)}>
            Cancel
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Dept</th>
            <th>Salary</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            // The row being edited is highlighted. `editing?.id` is optional chaining (JS step 10):
            // it is undefined when editing is null instead of crashing.
            <tr key={e.id} style={{ background: editing?.id === e.id ? "#fff7d6" : undefined }}>
              <td>{e.name}</td>
              <td>{e.department}</td>
              <td>{e.salary}</td>
              <td>
                {/* Clicking Edit stores THIS employee in `editing`, which triggers the effect */}
                <button onClick={() => setEditing(e)}>Edit</button>
                <button onClick={() => setEmployees((list) => list.filter((x) => x.id !== e.id))}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
