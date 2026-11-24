// =====================================================================================
// STEP 12 - Rules of Hooks and common mistakes
//
// React remembers hook state by the ORDER in which hooks are called in each render
// (first useState, second useState, then useEffect ...). If the order changes between renders, React
// would attach the wrong state to the wrong hook. Two rules keep the order stable:
//
//   RULE 1: Call hooks only at the TOP LEVEL of a component or custom hook.
//           Never inside if/else, loops, nested functions, try/catch or after an early return.
//   RULE 2: Call hooks only from React function components or from other custom hooks.
//           Never from normal functions, class components or event handlers.
//
// The ESLint plugin 'react-hooks' checks both rules for you. Keep it enabled.
// =====================================================================================

import { useEffect, useState } from "react";

export const meta = {
  title: "Rules of Hooks and common mistakes",
  concept: "Hooks must be called in the same order on every render: top level only, inside components or custom hooks.",
  newInThisStep: [
    "Rule 1: top level only (no if, loops, nested functions, early returns before a hook)",
    "Rule 2: only in components and custom hooks",
    "How to do 'conditional' hooks correctly: put the hook in a child component, or call it always and use the condition inside",
    "Checklist of the most common hook mistakes",
  ],
  tryThis: [
    "Read the WRONG examples in the comments and say which rule each breaks",
    "Toggle the profile on and off: the hook inside Profile is fine because Profile is always rendered or not as a whole",
    "Enable the lint rule in your editor and see the red underline on a hook inside an if",
  ],
};

// ---- WRONG: hook inside a condition (breaks rule 1) ----------------------------------------
//
// function Bad({ loggedIn }) {
//   if (loggedIn) {
//     const [name, setName] = useState("");   // sometimes called, sometimes not -> order changes -> React error
//   }
// }
//
// ---- WRONG: hook after an early return --------------------------------------------------------
//
// function Bad2({ id }) {
//   if (!id) return null;                      // returns before the hook below on some renders
//   useEffect(() => {}, [id]);
// }
//
// ---- WRONG: hook in an event handler or loop ----------------------------------------------------
//
// <button onClick={() => { const [x, setX] = useState(0); }} />       // not allowed
// items.forEach((item) => useEffect(() => {}, []));                    // not allowed

// ---- RIGHT 1: move the condition INSIDE the hook (the hook itself is always called) -------------
function Greeting({ loggedIn }) {
  const [name, setName] = useState("Asha"); // always called, every render, same order
  useEffect(() => {
    if (loggedIn) console.log(`${name} logged in`); // the condition lives inside the effect
  }, [loggedIn, name]);
  return loggedIn ? <p>Welcome back, {name}!</p> : <p>Please log in.</p>;
}

// ---- RIGHT 2: need hooks only sometimes? Put them in a CHILD component ------------------------------
// Profile has its own hooks. The parent decides whether to render <Profile /> at all.
function Profile() {
  const [clicks, setClicks] = useState(0);
  return (
    <div className="card">
      <p>Profile component with its own state: {clicks} clicks</p>
      <button onClick={() => setClicks(clicks + 1)}>+1</button>
    </div>
  );
}

export default function Demo() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showProfile, setShowProfile] = useState(true);

  return (
    <div>
      <button onClick={() => setLoggedIn(!loggedIn)}>{loggedIn ? "Log out" : "Log in"}</button>
      <button onClick={() => setShowProfile(!showProfile)}>{showProfile ? "Hide profile" : "Show profile"}</button>

      <Greeting loggedIn={loggedIn} />
      {showProfile && <Profile />}

      <div className="card">
        <b>Common hook mistakes checklist</b>
        <ul>
          <li>Hook inside if / loop / nested function (rules 1 and 2)</li>
          <li>Missing dependency in useEffect, useMemo or useCallback (stale values)</li>
          <li>No cleanup for timers, listeners or subscriptions (leaks)</li>
          <li>Changing state in an effect without a condition (infinite loop)</li>
          <li>Mutating state instead of creating a new value</li>
          <li>Creating an object or array in render and using it as a dependency</li>
          <li>Using useEffect to compute values that could be calculated during render</li>
        </ul>
      </div>
    </div>
  );
}
