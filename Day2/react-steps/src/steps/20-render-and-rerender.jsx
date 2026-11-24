// =====================================================================================
// STEP 20 - How React renders: render counts and the render process
//
// THE RENDER CYCLE
//   1. State changes (a setter is called).
//   2. React calls the component function again: this is a "render" (it is just running your function).
//   3. The function returns new JSX = a lightweight description of the UI, the "virtual DOM".
//   4. React compares ("diffs") the new description with the previous one: RECONCILIATION.
//   5. Only the differences are applied to the real browser DOM ("commit"). The real DOM is slow, so
//      touching as little of it as possible is the point of the virtual DOM.
// Modern React implements this with the "Fiber" architecture, which can split the work into small
// pieces, pause it and resume it so the page stays responsive.
// =====================================================================================

import { useRef, useState } from "react";

export const meta = {
  title: "Rendering and re-rendering",
  concept: "When state changes, React calls that component again (render), compares the result with the previous one (reconciliation) and updates only what changed in the real DOM.",
  newInThisStep: [
    "Render = calling the component function again; it is NOT the same as touching the DOM",
    "A parent re-render re-renders all its children (even when their props are unchanged)",
    "A child's own state change re-renders only that child and its descendants",
    "Virtual DOM: React builds a lightweight tree, diffs it with the previous one, then patches the real DOM",
  ],
  tryThis: [
    "Click 'Re-render parent' and watch BOTH child counters go up",
    "Click 'Child state +1' and see that only that child (and not the parent) re-renders",
    "Open the console: every render logs a line",
    "Note: in development StrictMode renders twice, so the counters may jump by 2",
  ],
};

// A tiny custom hook (a function starting with "use" that uses other hooks).
// useRef keeps a value across renders WITHOUT triggering a render when it changes,
// so it is perfect for counting renders. Every call of the component runs `count.current += 1`.
function useRenderCount() {
  const count = useRef(0);
  count.current += 1;
  return count.current;
}

// A child with no props and no state. It still re-renders when its PARENT renders.
function Child({ label }) {
  const renders = useRenderCount();
  console.log(`render: ${label}`); // appears in the console every time this function runs
  return (
    <p>
      {label} rendered <b>{renders}</b> time(s)
    </p>
  );
}

// A child with its OWN state. Changing it re-renders only this component (the parent is not involved).
function ChildWithState() {
  const renders = useRenderCount();
  const [n, setN] = useState(0);
  console.log("render: ChildWithState");
  return (
    <p>
      ChildWithState rendered <b>{renders}</b> time(s), own state: {n}{" "}
      <button onClick={() => setN(n + 1)}>Child state +1</button>
    </p>
  );
}

export default function Demo() {
  const renders = useRenderCount();
  const [tick, setTick] = useState(0); // changing it re-renders the parent, and therefore all its children
  console.log("render: Parent");

  return (
    <div>
      <p>
        Parent rendered <b>{renders}</b> time(s), tick = {tick}
      </p>
      <button onClick={() => setTick(tick + 1)}>Re-render parent</button>
      <Child label="Child A (no props)" />
      <Child label="Child B (no props)" />
      <ChildWithState />
    </div>
  );
}
