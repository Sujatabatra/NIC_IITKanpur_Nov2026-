// =====================================================================================
// STEP 02 - The dependency array: WHEN does the effect run?
//
// useEffect(fn, [dep1, dep2])  -  the second argument is the "dependency array".
//   no array        -> run after EVERY render
//   []              -> run ONCE, after the first render (mount)
//   [a, b]          -> run after the first render, and again whenever a or b has CHANGED since last render
// React compares each dependency with its previous value (using ===) to decide.
// =====================================================================================

import { useEffect, useState } from "react";

export const meta = {
  title: "The dependency array",
  concept: "The second argument of useEffect decides when the effect runs: always, once, or when chosen values change.",
  newInThisStep: [
    "No array: runs after every render",
    "[] : runs only once, after the first render",
    "[count] : runs after the first render and whenever count changes",
    "Values used inside the effect must be listed as dependencies (the linter rule 'exhaustive-deps')",
  ],
  tryThis: [
    "Open the console. Click '+1 count' and then type in the text box: see which effects fire",
    "Which of the three effects runs when you only type in the text box? Why not the other two?",
    "Add `text` to the dependency array of the [count] effect and repeat",
  ],
};

export default function Demo() {
  // Two independent pieces of state, so we can change one without the other.
  const [count, setCount] = useState(0);
  const [text, setText] = useState("");

  // EFFECT A - no dependency array: runs after EVERY render, whatever changed.
  useEffect(() => {
    console.log("A (no array): runs after every render");
  });

  // EFFECT B - empty array: runs ONCE after the first render only.
  // Typical use: fetch the initial data, set up a subscription.
  useEffect(() => {
    console.log("B ([]): runs once, after the first render");
  }, []);

  // EFFECT C - [count]: runs after the first render, then only when count is different from last time.
  // Typing in the text box re-renders the component, but count did not change, so C is skipped.
  useEffect(() => {
    console.log("C ([count]): count is now", count);
  }, [count]);

  return (
    <div>
      <p>
        count = <b>{count}</b>
      </p>
      <button onClick={() => setCount(count + 1)}>+1 count</button>
      <p>
        <input placeholder="type here (changes text, not count)" value={text} onChange={(e) => setText(e.target.value)} style={{ width: 300 }} />
      </p>
      <p>
        <small>
          Note: in development React StrictMode runs effects an extra time on the very first render (mount, cleanup, mount) to
          help you find bugs, so effect B may print twice at the start. This does not happen in a production build.
        </small>
      </p>
    </div>
  );
}
