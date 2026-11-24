// =====================================================================================
// STEP 09 - State vs normal variables, and functional updates
//
// TWO IMPORTANT FACTS ABOUT STATE
//   1) A normal variable does NOT survive a re-render and does NOT cause one. State does both.
//   2) A state update is not instant: inside one event handler, `count` still holds the OLD value.
//      When the new value depends on the old one, pass a FUNCTION to the setter: setCount(c => c + 1).
// =====================================================================================

import { useState } from "react";

export const meta = {
  title: "State vs variable, functional updates",
  concept: "A plain variable resets on every render and never updates the screen. State does both jobs.",
  newInThisStep: [
    "A normal variable changes but does NOT trigger a re-render, and resets each render",
    "setCount(prev => prev + 1): use the previous value when the new value depends on it",
    "Several setCount(count + 1) calls in one handler all see the SAME old count",
    "State updates are batched: React re-renders once after the handler",
  ],
  tryThis: [
    "Click 'Increment plain variable' and check the console: the screen never changes",
    "Click '+3 (wrong)' then '+3 (right)' and compare the results",
    "Why does +3 (wrong) only add 1?",
  ],
};

export default function Demo() {
  const [count, setCount] = useState(0);
  
  // A NORMAL variable: it is recreated as 0 every time this function runs (every render),
  // and changing it does not tell React to re-render.
  let plain = 0;

  const addThreeWrong = () => {
    // `count` is a snapshot taken when this render happened. In all three lines it is the same
    // number (say 0), so we ask React to set 1, then 1, then 1. Final result: +1 only.
    setCount(count + 1);
    setCount(count + 1);
    setCount(count + 1);
  };

  const addThreeRight = () => {
    // Passing a FUNCTION tells React: "take the latest value and compute the next one".
    // The three updates are queued and applied one after another: +1, +1, +1 = +3.
    setCount((c) => c + 1);
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  };

  return (
    <div>
      <h3>count (state): {count}</h3>
      <button onClick={addThreeWrong}>+3 (wrong)</button>
      <button onClick={addThreeRight}>+3 (right)</button>
      <button onClick={() => setCount(0)}>Reset</button>

      <h3>plain variable: {plain}</h3>
      <button
        onClick={() => {
          plain++; // the variable changes...
          console.log("plain is now", plain, "(but the screen did not re-render)"); // ...but React is never told
        }}
      >
        Increment plain variable
      </button>
    </div>
  );
}
