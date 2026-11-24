// =====================================================================================
// STEP 16 - Child to parent communication and lifting state up
//
// Step 15 put everything in one component. Real apps split it into small components.
// The rule of React data flow:
//   - Data flows DOWN: a parent passes data to children as props.
//   - Events flow UP: a child cannot change the parent's state directly. The parent passes a
//     FUNCTION as a prop (a "callback"), and the child calls it when something happens.
// "Lifting state up" means: when two components need the same data, move that state to their
// nearest common parent.
// =====================================================================================

import { useEffect, useState } from "react";

export const meta = {
  title: "Callbacks and lifting state up",
  concept: "Data flows DOWN as props; events flow UP by calling functions that the parent passed down.",
  newInThisStep: [
    "EmployeeApp (parent) owns the state: employees and editing",
    "EmployeeForm and EmployeeTable are children that receive props only",
    "Child -> parent: the child calls onSave(data), onEdit(employee), onDelete(id)",
    "Lifting state up: shared state lives in the nearest common parent",
  ],
  tryThis: [
    "Find every prop passed from EmployeeApp and mark whether it is data or a function",
    "Add an onClear callback prop to the table that empties the list",
    "Move the 'employees' state into EmployeeTable and see why the form can no longer add to it",
  ],
};

const empty = { name: "", department: "IT", salary: "" };

// ---- child 1: the form ---------------------------------------------------------------------
// Props received: `editing` (data, from the parent) and `onSave`, `onCancel` (functions, from the parent).
// The form keeps ONLY the state that belongs to it: what is typed right now.
function EmployeeForm({ editing, onSave, onCancel }) {
  const [form, setForm] = useState(empty);

  // When the parent says "edit this employee" (via the editing prop), show it in the form.
  useEffect(() => setForm(editing ?? empty), [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.salary) return;
    // CHILD -> PARENT: the form does not know HOW the list is stored. It only reports the new data.
    onSave({ name: form.name, department: form.department, salary: Number(form.salary) });
    setForm(empty);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
      <select name="department" value={form.department} onChange={handleChange}>
        <option>IT</option>
        <option>HR</option>
        <option>Finance</option>
      </select>
      <input name="salary" type="number" placeholder="Salary" value={form.salary} onChange={handleChange} />
      <button type="submit">{editing ? "Update" : "Add"}</button>
      {editing && (
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      )}
    </form>
  );
}

// ---- child 2: the table --------------------------------------------------------------------
// It owns NO state at all: it only displays `employees` and reports clicks upward.
function EmployeeTable({ employees, onEdit, onDelete }) {
  if (employees.length === 0) return <p>No employees yet.</p>;
  return (
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
          <tr key={e.id}>
            <td>{e.name}</td>
            <td>{e.department}</td>
            <td>{e.salary}</td>
            <td>
              {/* CHILD -> PARENT: tell the parent which employee/id was clicked */}
              <button onClick={() => onEdit(e)}>Edit</button>
              <button onClick={() => onDelete(e.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ---- parent: owns the shared state --------------------------------------------------------
// The form AND the table both need `employees` and `editing`, so that state lives HERE,
// in their nearest common parent ("lifted up").
function EmployeeApp() {
  const [employees, setEmployees] = useState([{ id: 1, name: "Asha", department: "IT", salary: 60000 }]);
  const [editing, setEditing] = useState(null);

  // These handlers are the ONLY code that changes the list. They are passed down as props.
  const handleSave = (data) => {
    if (editing) {
      setEmployees((list) => list.map((e) => (e.id === editing.id ? { ...e, ...data } : e)));
      setEditing(null);
    } else {
      setEmployees((list) => [...list, { ...data, id: Date.now() }]);
    }
  };
  const handleDelete = (id) => setEmployees((list) => list.filter((e) => e.id !== id));

  return (
    <>
      <h4>Employees ({employees.length})</h4>
      {/* PARENT -> CHILD: data (editing, employees) and functions (onSave, onEdit, ...) as props.
          onEdit={setEditing}: the setter itself is a function, so it can be passed directly. */}
      <EmployeeForm editing={editing} onSave={handleSave} onCancel={() => setEditing(null)} />
      <EmployeeTable employees={employees} onEdit={setEditing} onDelete={handleDelete} />
    </>
  );
}

export default function Demo() {
  return <EmployeeApp />;
}
