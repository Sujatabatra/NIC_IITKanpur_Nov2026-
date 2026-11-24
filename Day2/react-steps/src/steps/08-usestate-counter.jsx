// =====================================================================================
// STEP 08 - State with useState
//
// STATE is data that a component REMEMBERS and that can change over time (a counter value,
// text typed in a box, a list of records). When state changes, React runs the component function
// again ("re-render") so the screen shows the new value.
// =====================================================================================

// useState is a "hook": a function provided by React. Hooks are imported from "react".
import { useState } from "react";

export const meta = {
  title: "useState: a counter",
  concept: "useState gives a component memory. Calling the setter updates the value and re-renders.",
  newInThisStep: [
    "const [count, setCount] = useState(0): current value + setter function",
    "The initial value (0) is used only on the first render",
    "Call setCount(newValue); never change count directly",
    "Each component instance has its own, independent state",
  ],
  tryThis: [
    "Click the buttons on both counters: they do not share state",
    "Add a 'Reset' button that calls setCount(0)",
    "Add a second piece of state, e.g. const [step, setStep] = useState(1), and use it in the +/- buttons",
  ],
};

function Counter({ label }) {
  // NEW: state.
  // useState(0) returns an ARRAY of two things (array destructuring, JS step 05):
  //   count    -> the current value (0 on the first render)
  //   setCount -> a function that stores a new value AND asks React to re-render
  // The names are our choice; the convention is [thing, setThing].
  const [count, setCount] = useState(0);

  return (
    <div style={{ margin: "10px 0" }}>
      <b>
        {label}: {count}
      </b>{" "}
      {/* Clicking calls setCount with the new value. React then calls Counter() again,
          and this time useState returns the NEW count, so the screen updates. */}
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
    </div>
  );
}

export default function Demo() {
  // Two instances of the same component. Each one has its OWN state, so clicking
  // Counter A does not change Counter B.
  return (
    <>
      <Counter label="Counter A" />
      <Counter label="Counter B" />
    </>
  );
}
