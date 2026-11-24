// =====================================================================================
// STEP 22 - The complete Day 1 application
//
// Everything from steps 01-21 in one small app:
//   components + props + children (02-04)       lists + keys (05, 21)
//   events + controlled forms + validation (07, 10-12)
//   state + arrays in state + CRUD (08-09, 13-15)
//   callbacks and lifting state up (16)
// NEW here: DERIVED DATA (search + total) and PERSISTENCE (localStorage).
// =====================================================================================

import { useEffect, useState } from "react";

export const meta = {
  title: "Complete employee app",
  concept: "Combine every Day 1 concept in one small application.",
  newInThisStep: [
    "Search box: filtered list is DERIVED from state during render (never stored)",
    "Total salary of the visible rows with reduce",
    "Persist the list in localStorage with useEffect (survives a page refresh)",
    "Reusable Card, Form, Table components with the parent owning the data",
  ],
  tryThis: [
    "Add, edit and delete employees, then refresh the page",
    "Search for part of a name and watch the total change",
    "Add a department filter (select) next to the search box as a challenge",
  ],
};

const empty = { name: "", email: "", department: "IT", salary: "" };
const initial = [{ id: 1, name: "Asha", email: "asha@iitk.ac.in", department: "IT", salary: 60000 }];

// ---- Reusable layout component (step 04) ---------------------------------------------------
function Card({ title, children }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

// ---- Form component: owns only its own typing state (steps 11, 12, 15, 16) --------------
function EmployeeForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});

  // Load the employee being edited into the form (step 15)
  useEffect(() => {
    setForm(editing ?? empty);
    setErrors({});
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Validation (step 12)
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.salary || Number(form.salary) <= 0) e.salary = "Salary must be positive";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ ...form, salary: Number(form.salary) }); // report upward (step 16)
    setForm(empty);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 6, maxWidth: 340 }}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      {errors.name && <small className="err">{errors.name}</small>}
      <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
      {errors.email && <small className="err">{errors.email}</small>}
      <select name="department" value={form.department} onChange={handleChange}>
        <option>IT</option>
        <option>HR</option>
        <option>Finance</option>
      </select>
      <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} />
      {errors.salary && <small className="err">{errors.salary}</small>}
      <div>
        <button type="submit">{editing ? "Update" : "Add"}</button>
        {editing && (
          <button type="button" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

// ---- Table component: pure display, no state (steps 05, 06, 16) ---------------------------
function EmployeeTable({ employees, onEdit, onDelete }) {
  if (employees.length === 0) return <p>No employees found.</p>;
  return (
    <table style={{ width: "100%" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Dept</th>
          <th>Salary</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {employees.map((e) => (
          <tr key={e.id}>
            <td>{e.name}</td>
            <td>{e.email}</td>
            <td>{e.department}</td>
            {/* toLocaleString("en-IN") formats 60000 as 60,000 using Indian digit grouping */}
            <td>{e.salary.toLocaleString("en-IN")}</td>
            <td>
              <button onClick={() => onEdit(e)}>Edit</button>
              <button onClick={() => onDelete(e.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---- The parent: owns the data (step 16) ------------------------------------------------------
export default function Demo() {
  // NEW: PERSISTENCE, part 1 - read the saved list when the component first loads.
  // Passing a FUNCTION to useState ("lazy initialiser") makes React run it only once, on the first render,
  // instead of reading localStorage on every render. localStorage only stores text, so we JSON.parse it.
  // try/catch protects us from broken saved data; ?? falls back to the sample data when nothing is saved.
  const [employees, setEmployees] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("day1-steps-employees")) ?? initial;
    } catch {
      return initial;
    }
  });
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");

  // NEW: PERSISTENCE, part 2 - save the list whenever it changes.
  // The dependency array [employees] means: run this effect after the first render and
  // after every render where `employees` changed. JSON.stringify turns the array into text.
  useEffect(() => {
    localStorage.setItem("day1-steps-employees", JSON.stringify(employees));
  }, [employees]);

  const handleSave = (data) => {
    if (editing) {
      setEmployees((list) => list.map((e) => (e.id === editing.id ? { ...e, ...data } : e)));
      setEditing(null);
    } else {
      setEmployees((list) => [...list, { ...data, id: Date.now() }]);
    }
  };
  const handleDelete = (id) => setEmployees((list) => list.filter((e) => e.id !== id));

  // NEW: DERIVED DATA. `visible` and `total` are calculated from `employees` and `search` every render.
  // We do NOT store them in state: that would create a second copy that can get out of sync.
  const visible = employees.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
  const total = visible.reduce((sum, e) => sum + e.salary, 0);

  return (
    <>
      <Card title={editing ? "Edit employee" : "Add employee"}>
        <EmployeeForm editing={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
      </Card>
      <Card title={`Employees (${visible.length} of ${employees.length})`}>
        <p>
          <input placeholder="Search by name" value={search} onChange={(e) => setSearch(e.target.value)} />
        </p>
        <EmployeeTable employees={visible} onEdit={setEditing} onDelete={handleDelete} />
        <p>
          <b>Total salary (shown rows): {total.toLocaleString("en-IN")}</b>
        </p>
      </Card>
    </>
  );
}
