// =====================================================================================
// STEP 22 - Choosing the right state solution
//
// You now know five tools. Use the SMALLEST tool that solves the problem:
//
//   useState / useReducer   state that belongs to ONE component (or a parent and a couple of children)
//   Lifting state up        two or three components share it: move it to their nearest parent
//   Context API             a few values needed by MANY components, changing rarely (theme, current user, language)
//   Redux Toolkit           large shared state, many updates, complex logic, DevTools/time-travel, middleware
//   Recoil / Jotai / Zustand  fine-grained shared atoms (Recoil is no longer maintained: prefer RTK, Zustand or Jotai)
//
// This lesson is an interactive helper: answer the questions and read the recommendation.
// =====================================================================================

import { useState } from "react";

export const meta = {
  title: "Choosing a state solution",
  concept: "Pick local state first, then lifting, Context, and Redux Toolkit only when the need grows.",
  newInThisStep: [
    "A decision guide, not new syntax",
    "Questions: how many components? how often does it change? how complex is the logic?",
    "Start simple and move up only when you feel the pain",
    "Server data (API results) is a separate topic: React Query / RTK Query handle caching better than hand-written state",
  ],
  tryThis: [
    "Answer the questions for a theme switch, a shopping cart and a search box",
    "Discuss with a neighbour: where would you put the logged-in user? the form values of a single page?",
    "Look back at lessons 13-21 and mark which one you would use for each answer",
  ],
};

export default function Demo() {
  const [many, setMany] = useState(false); // used by many components, far apart in the tree?
  const [frequent, setFrequent] = useState(false); // changes very often (every keystroke / tick)?
  const [complex, setComplex] = useState(false); // complex update logic, needs debugging tools?
  const [shared, setShared] = useState(true); // shared by more than one component at all?

  let advice;
  if (!shared) advice = ["useState (or useReducer)", "Only one component needs it: keep it local."];
  else if (!many) advice = ["Lift state up to the nearest common parent", "A few nearby components share it: pass props and callbacks (Day 1 step 16)."];
  else if (complex || frequent) advice = ["Redux Toolkit", "Many components, frequent or complex updates: a store with selectors and DevTools pays off."];
  else advice = ["Context API", "Many components read a value that changes rarely (theme, user, language)."];

  const Q = ({ label, value, set }) => (
    <label style={{ display: "block", margin: "6px 0" }}>
      <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} /> {label}
    </label>
  );

  return (
    <div>
      <Q label="Is the state shared by more than one component?" value={shared} set={setShared} />
      <Q label="Do many components, far apart in the tree, need it?" value={many} set={setMany} />
      <Q label="Does it change very often (every keystroke, every tick)?" value={frequent} set={setFrequent} />
      <Q label="Is the update logic complex (many actions, you want DevTools)?" value={complex} set={setComplex} />

      <div className="card" style={{ background: "#ecfeff" }}>
        <h3>Recommendation: {advice[0]}</h3>
        <p>{advice[1]}</p>
      </div>

      <table>
        <thead>
          <tr>
            <th>Tool</th>
            <th>Scope</th>
            <th>Setup</th>
            <th>Re-renders</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>useState / useReducer</td>
            <td>one component</td>
            <td>none</td>
            <td>only that component</td>
          </tr>
          <tr>
            <td>Context API</td>
            <td>a subtree</td>
            <td>small (Provider + hook)</td>
            <td>all consumers on change</td>
          </tr>
          <tr>
            <td>Redux Toolkit</td>
            <td>whole app</td>
            <td>medium (slice, store, Provider)</td>
            <td>only components whose selected value changed</td>
          </tr>
          <tr>
            <td>Recoil (legacy)</td>
            <td>whole app</td>
            <td>small (RecoilRoot, atoms)</td>
            <td>only components using a changed atom</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
