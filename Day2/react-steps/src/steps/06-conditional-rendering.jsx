// =====================================================================================
// STEP 06 - Conditional rendering
//
// JSX has no special "if" tag. You use normal JavaScript: an early `return`, the ternary
// operator (condition ? a : b), or logical AND (condition && element).
// =====================================================================================

export const meta = {
  title: "Conditional rendering",
  concept: "Use JavaScript conditions inside JSX to decide what appears.",
  newInThisStep: [
    "Ternary: {condition ? <A /> : <B />}",
    "Logical AND: {condition && <A />} (renders A only when true)",
    "Early return: if (list.length === 0) return <p>Empty</p>;",
    "Careful: {0 && <A />} renders the number 0, so compare explicitly",
  ],
  tryThis: [
    "Set the employees array to [] and see the empty state",
    "Change an employee's salary above 70000 to see the badge",
    "Add a role: 'admin' field and show an Admin tag with &&",
  ],
};

const employees = [
  { id: 1, name: "Asha", salary: 60000, active: true },
  { id: 2, name: "Ravi", salary: 45000, active: false },
  { id: 3, name: "Meera", salary: 85000, active: true },
];

function EmployeeList({ list }) {
  // PATTERN 1 - early return: handle the special case first and leave the function.
  // Everything below only runs when the list has items.
  if (list.length === 0) return <p>No employees yet.</p>;

  return (
    <ul>
      {list.map((e) => (
        <li key={e.id}>
          {e.name}{" "}
          {/* PATTERN 2 - ternary: choose between TWO outcomes */}
          <span className="badge">{e.active ? "Active" : "Inactive"}</span>
          {/* PATTERN 3 - &&: show something only when the condition is true, otherwise nothing.
              (If the left side were the number 0, React would print "0", so use a real comparison like > 70000.) */}
          {e.salary > 70000 && <b style={{ color: "green" }}> High earner</b>}
        </li>
      ))}
    </ul>
  );
}

export default function Demo() {
  return (
    <>
      {/* same component, two different data sets: one with items, one empty */}
      <EmployeeList list={employees} />
      <EmployeeList list={[]} />
    </>
  );
}
