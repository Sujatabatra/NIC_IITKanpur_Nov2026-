// =====================================================================================
// STEP 17 - Sibling components share data through their parent
//
// Siblings (two components next to each other) cannot send data directly to each other.
// Pattern:   Sibling A --(callback)--> PARENT (holds state) --(props)--> Sibling B
// This is just step 16 used twice: events go up, data comes down.
// =====================================================================================

import { useState } from "react";

export const meta = {
  title: "Sibling communication",
  concept: "Two components that are not parent and child cannot talk directly. They share state through a common parent.",
  newInThisStep: [
    "Parent holds selectedId in state",
    "Sibling A (EmployeeList) calls onSelect(id) when a name is clicked (child -> parent)",
    "Sibling B (EmployeeDetails) receives the selected employee as a prop (parent -> child)",
    "Neither sibling knows the other exists",
  ],
  tryThis: [
    "Click different names and watch the details panel change",
    "Add a 'Clear selection' button inside EmployeeDetails (hint: a callback prop)",
    "Add a third sibling that shows only the selected employee's salary",
  ],
};

const employees = [
  { id: 1, name: "Asha", department: "IT", salary: 60000, city: "Kanpur" },
  { id: 2, name: "Ravi", department: "HR", salary: 45000, city: "Lucknow" },
  { id: 3, name: "Meera", department: "IT", salary: 85000, city: "Delhi" },
];

// ---- Sibling A: shows the names and reports clicks -----------------------------------------
// `selectedId` (data) lets it highlight the chosen name; `onSelect` (function) reports a click.
function EmployeeList({ selectedId, onSelect }) {
  return (
    <ul>
      {employees.map((e) => (
        <li key={e.id}>
          <button onClick={() => onSelect(e.id)} style={{ fontWeight: e.id === selectedId ? "bold" : "normal" }}>
            {e.name}
          </button>
        </li>
      ))}
    </ul>
  );
}

// ---- Sibling B: shows the details of whoever was selected ------------------------------
// It only receives data. It has no idea that a list component exists.
function EmployeeDetails({ employee, onClear }) {
  if (!employee) return <p>Select an employee on the left.</p>;
  return (
    <div className="card" style={{ margin: 0 }}>
      <h4 style={{ marginTop: 0 }}>{employee.name}</h4>
      <p>Department: {employee.department}</p>
      <p>Salary: {employee.salary}</p>
      <p>City: {employee.city}</p>
      <button onClick={onClear}>Clear</button>
    </div>
  );
}

// ---- Parent: the only component that knows about the selection --------------------------
export default function Demo() {
  // Store only the ID. Storing the whole employee would duplicate data and could become stale.
  const [selectedId, setSelectedId] = useState(null);

  // DERIVED VALUE: computed from state during render, not stored in state.
  // `?? null` gives null (instead of undefined) when nothing is selected.
  const selected = employees.find((e) => e.id === selectedId) ?? null;

  return (
    // CSS grid with two columns: the list on the left, the details on the right
    <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 16 }}>
      {/* setSelectedId is passed as the callback: Sibling A calls it with an id */}
      <EmployeeList selectedId={selectedId} onSelect={setSelectedId} />
      {/* the parent converts the id into the full employee and hands it to Sibling B */}
      <EmployeeDetails employee={selected} onClear={() => setSelectedId(null)} />
    </div>
  );
}
