// =====================================================================================
// STEP 13 - Arrays in state: adding records and showing them in a table
//
// A list of records is simply an ARRAY held in state. The golden rule:
//   NEVER change state in place (push, splice, assigning to a property).
//   ALWAYS give the setter a NEW array/object (JS step 06).
// React decides whether to re-render by checking if the state is a different value.
// =====================================================================================

import { useState } from "react";

export const meta = {
  title: "Arrays in state: add",
  concept: "A list of records is just an array in state. To add one, create a NEW array with the spread operator.",
  newInThisStep: [
    "const [employees, setEmployees] = useState([ ...initial data ])",
    "Add: setEmployees(list => [...list, newEmployee]) (never list.push)",
    "Every record gets a unique id (Date.now() here; the database provides one later)",
    "The table re-renders automatically because the state changed",
  ],
  tryThis: [
    "Add a few employees and watch the count and total change",
    "Replace the handler body with employees.push(...) and see that nothing re-renders",
    "Show the total salary under the table using reduce",
  ],
};

// Starting values of the form, reused to reset it after adding.
const empty = { name: "", department: "IT", salary: "" };

export default function Demo() {
  // State #1: the list of records. We start with one employee so the table is not empty.
  const [employees, setEmployees] = useState([{ id: 1, name: "Asha", department: "IT", salary: 60000 }]);
  // State #2: what the user is currently typing in the form
  const [form, setForm] = useState(empty);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.salary) return; // very small validation (step 12 has the full version)

    // NEW: ADD = build a new array containing the old items plus the new one.
    //   `list` is the previous array (functional update, step 09).
    //   id: Date.now() gives a number that is practically unique. A real database creates ids for you.
    setEmployees((list) => [
      ...list,
      { id: Date.now(), name: form.name, department: form.department, salary: Number(form.salary) },
    ]);
    setForm(empty); // clear the form
  };

  return (
    <div>
      <form onSubmit={handleAdd} style={{ marginBottom: 12 }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <select name="department" value={form.department} onChange={handleChange}>
          <option>IT</option>
          <option>HR</option>
          <option>Finance</option>
        </select>
        <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} />
        <button type="submit">Add</button>
      </form>

      {/* employees.length always reflects the current state */}
      <h4>Employees ({employees.length})</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Dept</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {/* map + key (step 05): one row per record; adding a record adds a row automatically */}
          {employees.map((e) => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.department}</td>
              <td>{e.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
