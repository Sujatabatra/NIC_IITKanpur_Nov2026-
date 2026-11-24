// =====================================================================================
// STEP 08 - React.memo and useCallback: stop needless child re-renders
//
// Day 1: when a parent re-renders, ALL its children re-render too, even with identical props.
//   React.memo(Component)   -> "re-render this child only if its props really changed" (compares with ===)
// BUT: a function created inside the parent is a NEW function on every render, so for memo it is a
// "changed prop" every time, which defeats memo.
//   useCallback(fn, deps)   -> returns the SAME function between renders until deps change.
// Rule of thumb: memo + useCallback work as a pair. Use them only for components that are costly to render.
// =====================================================================================

import { memo, useCallback, useRef, useState } from "react";

export const meta = {
  title: "memo and useCallback",
  concept: "React.memo skips re-rendering a child when props are unchanged. useCallback keeps a function prop stable so memo can work.",
  newInThisStep: [
    "const Child = memo(function Child(props) { ... })",
    "A function created in the parent is new on every render, so memo sees a changed prop",
    "useCallback(fn, [deps]) returns the same function until a dependency changes",
    "Compare three children and their render counters",
  ],
  tryThis: [
    "Press 'Re-render parent' and compare the three counters",
    "Which child is 'memo + new function every time'? Why does memo not help it?",
    "Press 'Count + 1' a few times: the useCallback child must still use the latest count (check its text)",
  ],
};

// A small helper that counts renders using a ref (Day 2 step 06).
function useRenderCount() {
  const count = useRef(0);
  count.current += 1;
  return count.current;
}

// 1) A normal child: re-renders every time the parent renders.
function PlainChild({ onClick }) {
  const renders = useRenderCount();
  return (
    <p>
      Plain child rendered <b>{renders}</b> times <button onClick={onClick}>click</button>
    </p>
  );
}

// 2) memo child: skips renders when props are identical. We will give it an UNSTABLE function.
const MemoChild = memo(function MemoChild({ onClick }) {
  const renders = useRenderCount();
  return (
    <p>
      memo child (new function each time) rendered <b>{renders}</b> times <button onClick={onClick}>click</button>
    </p>
  );
});

// 3) The same memo component; we will give it a STABLE function from useCallback.
const MemoChildStable = memo(function MemoChildStable({ onClick, count }) {
  const renders = useRenderCount();
  return (
    <p>
      memo child + useCallback rendered <b>{renders}</b> times (count = {count}) <button onClick={onClick}>click</button>
    </p>
  );
});

export default function Demo() {
  const [count, setCount] = useState(0);
  const [tick, setTick] = useState(0); // unrelated state: changing it re-renders the parent

  // A new function object is created on EVERY render of Demo.
  const unstable = () => console.log("unstable clicked");

  // The same function object is reused until the dependencies ([] = never) change.
  const stable = useCallback(() => console.log("stable clicked"), []);

  return (
    <div>
      <button onClick={() => setTick(tick + 1)}>Re-render parent (tick {tick})</button>
      <button onClick={() => setCount(count + 1)}>Count + 1 ({count})</button>
      <PlainChild onClick={unstable} />
      <MemoChild onClick={unstable} />
      {/* count is passed as a prop, so this memo child re-renders ONLY when count changes, not when tick changes */}
      <MemoChildStable onClick={stable} count={count} />
    </div>
  );
}
