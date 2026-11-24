// =====================================================================================
// STEP 19 - Props vs state, and one-way data flow
//
// PROPS : given to a component by its parent. READ-ONLY. The component does not own them.
// STATE : owned by the component itself. Changed only through its setter.
// ONE-WAY DATA FLOW: data moves from parent to child. A child that needs to change parent data
// calls a function the parent passed down (step 16).
//
// A classic bug demonstrated here: copying a prop into state "freezes" it at the first value.
// =====================================================================================

import { useState } from "react";

export const meta = {
  title: "Props vs state",
  concept: "State is owned and changed by a component. Props are given by the parent and are read-only.",
  newInThisStep: [
    "Parent state -> child prop: the child always shows the latest value",
    "Copying a prop into the child's own state freezes it at the first value (a common bug)",
    "Data flows one way: parent to child",
    "To change parent data from a child, call a function prop (step 16)",
  ],
  tryThis: [
    "Click 'Raise salary' in the parent and compare the two children",
    "Which child is right? Why does the other one not update?",
    "Fix the buggy child by removing its own state and using the prop directly",
  ],
};

// CORRECT: displays the prop directly. Whenever the parent re-renders with a new value, this shows it.
function SalaryFromProp({ salary }) {
  return (
    <p>
      From prop: <b>{salary}</b>
    </p>
  );
}

// BUGGY: useState(salary) uses the prop ONLY as the initial value, on the very first render.
// After that React keeps the old state, even if the prop changes. (We never call the setter,
// so we leave it out of the array destructuring with an empty slot.)
function SalaryCopiedToState({ salary }) {
  const [copy] = useState(salary);
  return (
    <p>
      Copied to state: <b>{copy}</b> (stale after the first render)
    </p>
  );
}

export default function Demo() {
  // This state belongs to the PARENT. Children receive its value as a prop.
  const [salary, setSalary] = useState(50000);

  return (
    <div>
      <p>
        Parent state: <b>{salary}</b>
      </p>
      <button onClick={() => setSalary((s) => s + 5000)}>Raise salary</button>

      {/* Same prop given to both children: only one of them keeps up */}
      <SalaryFromProp salary={salary} />
      <SalaryCopiedToState salary={salary} />

      {/* A summary table, written in plain JSX */}
      <table style={{ marginTop: 10 }}>
        <thead>
          <tr>
            <th></th>
            <th>Props</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Owned by</td>
            <td>the parent</td>
            <td>the component itself</td>
          </tr>
          <tr>
            <td>Can the component change it?</td>
            <td>No (read-only)</td>
            <td>Yes, with the setter</td>
          </tr>
          <tr>
            <td>Change triggers a re-render?</td>
            <td>Yes, when the parent re-renders</td>
            <td>Yes</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
