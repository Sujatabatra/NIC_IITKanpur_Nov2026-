// =====================================================================================
// STEP 14 - Update and delete records immutably
//
// With ADD (step 13) you now know all of CRUD's building blocks:
//   Create -> [...list, newItem]
//   Update -> list.map(item => item.id === id ? { ...item, ...changes } : item)
//   Delete -> list.filter(item => item.id !== id)
// All three return a NEW array, so the original state is never mutated.
// =====================================================================================

import { useState } from "react";

export const meta = {
  title: "Arrays in state: update and delete",
  concept: "Complete the CRUD pattern with map (update) and filter (delete). Never mutate state.",
  newInThisStep: [
    "Delete: setEmployees(list => list.filter(e => e.id !== id))",
    "Update one item: list.map(e => e.id === id ? { ...e, ...changes } : e)",
    "Toggle a boolean field (active / inactive) with the same map pattern",
    "Each row button passes ITS OWN id using an arrow function",
  ],
  tryThis: [
    "Delete a row, then toggle another row's status",
    "Add a 'Raise 10%' button that updates the salary with map",
    "Rewrite delete with splice (mutation) and observe the bug or missing update",
  ],
};

// Kept outside the component so the "Restore" button can reset to the same data.
const initial = [
  { id: 1, name: "Asha", salary: 60000, active: true },
  { id: 2, name: "Ravi", salary: 45000, active: true },
  { id: 3, name: "Meera", salary: 75000, active: false },
];

export default function Demo() {
  const [employees, setEmployees] = useState(initial);

  // NEW: DELETE.
  // filter keeps every employee whose id is NOT the one we want to remove.
  const handleDelete = (id) => setEmployees((list) => list.filter((e) => e.id !== id));

  // NEW: UPDATE.
  // map walks through every employee. For the matching id we return a changed COPY
  // ({ ...e, active: !e.active } copies e and flips one field); every other employee is returned as is.
  const toggleActive = (id) =>
    setEmployees((list) => list.map((e) => (e.id === id ? { ...e, active: !e.active } : e)));

  // Same pattern, different change: increase the salary by 10% (rounded).
  const raise = (id) =>
    setEmployees((list) => list.map((e) => (e.id === id ? { ...e, salary: Math.round(e.salary * 1.1) } : e)));

  return (
    <div>
      <button onClick={() => setEmployees(initial)}>Restore sample data</button>
      <table style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Salary</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((e) => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.salary}</td>
              <td>{e.active ? "Active" : "Inactive"}</td>
              <td>
                {/* Each button is created INSIDE map, so the arrow function remembers this row's id (a closure) */}
                <button onClick={() => toggleActive(e.id)}>Toggle status</button>
                <button onClick={() => raise(e.id)}>Raise 10%</button>
                <button onClick={() => handleDelete(e.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Conditional rendering (step 06): friendly message when everything was deleted */}
      {employees.length === 0 && <p>No employees left.</p>}
    </div>
  );
}
