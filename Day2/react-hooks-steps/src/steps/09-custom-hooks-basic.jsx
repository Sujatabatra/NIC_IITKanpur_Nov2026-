// =====================================================================================
// STEP 09 - Custom hooks: reuse logic between components
//
// A custom hook is just a FUNCTION whose name starts with "use" and that calls other hooks inside.
// It lets you extract stateful logic (state + effects) and share it, the same way a component shares UI.
// Each component that calls the hook gets its OWN separate state (hooks share logic, not data).
// =====================================================================================

import { useEffect, useState } from "react";

export const meta = {
  title: "Custom hooks (useToggle, useLocalStorage)",
  concept: "Extract repeated state logic into functions that start with 'use' and call other hooks.",
  newInThisStep: [
    "A custom hook is a normal function named useSomething that calls built-in hooks",
    "It returns whatever the component needs: values, setters, handlers",
    "Two components using the same hook have independent state",
    "useLocalStorage keeps state and the browser storage in sync",
  ],
  tryThis: [
    "Click each toggle: they are independent",
    "Type a name, refresh the page: it is still there (localStorage)",
    "Write your own useCounter(initial) hook that returns [count, increment, decrement, reset]",
  ],
};

// ---- custom hook 1: useToggle -----------------------------------------------------------
// Returns [current boolean, function that flips it].
function useToggle(initial = false) {
  const [on, setOn] = useState(initial);
  const toggle = () => setOn((v) => !v);
  return [on, toggle]; // returning an array lets callers pick their own names, like useState
}

// ---- custom hook 2: useLocalStorage -------------------------------------------------------
// Same API as useState, but the value also survives page refreshes.
function useLocalStorage(key, initialValue) {
  // Lazy initialiser (Day 1 step 22): read from storage only on the first render.
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue; // corrupt data or storage blocked
    }
  });

  // Whenever the value (or the key) changes, write it to storage. This is a side effect, so useEffect.
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// ---- components that USE the hooks --------------------------------------------------------
function Panel({ title }) {
  const [open, toggle] = useToggle(false); // each Panel has its own `open`
  return (
    <div className="card">
      <b>{title}</b> <button onClick={toggle}>{open ? "Hide" : "Show"}</button>
      {open && <p>Details of {title}.</p>}
    </div>
  );
}

export default function Demo() {
  const [name, setName] = useLocalStorage("day2-step09-name", "");
  return (
    <div>
      <Panel title="Panel A" />
      <Panel title="Panel B" />
      <p>
        <input placeholder="Your name (saved in localStorage)" value={name} onChange={(e) => setName(e.target.value)} />
      </p>
      <p>Hello, {name || "stranger"}!</p>
    </div>
  );
}
