// =====================================================================================
// STEP 05 - Effect pitfalls: stale values, race conditions and infinite loops
//
// Three classic mistakes with useEffect and how to fix each one.
//
//  A) STALE VALUE  - an effect with [] captures the values of the FIRST render forever.
//                    Fix: list the value in the dependency array (or use a functional update).
//  B) RACE CONDITION - two requests overlap and the OLD (slow) one finishes last and wins.
//                    Fix: ignore results of requests that are no longer current (cleanup flag).
//  C) INFINITE LOOP - an effect that sets state which is also in its own dependencies re-triggers itself.
//                    Fix: do not set that state unconditionally; compute it during render if you can.
// =====================================================================================

import { useEffect, useState } from "react";

export const meta = {
  title: "Effect pitfalls",
  concept: "Stale closures, race conditions and infinite loops: how to recognise and fix them.",
  newInThisStep: [
    "Closures: a function remembers the variables of the render that created it",
    "Dependency array tells React when the remembered values are out of date",
    "Cleanup with an `ignore` flag solves request race conditions",
    "Never set state that is in the same effect's dependency array without a condition",
  ],
  tryThis: [
    "A) Click +1 a few times. Compare 'stale' and 'fixed'",
    "B) Click 'User 1' and then 'User 2' quickly. Which result does the buggy version end on?",
    "C) Read the commented-out infinite loop and explain it to a neighbour",
  ],
};

// A fake API. User 1 is SLOW (1.5 s), others are fast (0.3 s): this makes the race condition easy to see.
const fetchUser = (id) =>
  new Promise((resolve) => setTimeout(() => resolve({ id, name: `User ${id}` }), id === 1 ? 1500 : 300));

// ---- A) stale value ---------------------------------------------------------------------
function StaleDemo() {
  const [count, setCount] = useState(0);
  const [staleSeen, setStaleSeen] = useState(0);
  const [fixedSeen, setFixedSeen] = useState(0);

  // BUGGY: [] means "run once". The function inside setInterval remembers count from the FIRST render (0) forever.
  useEffect(() => {
    const id = setInterval(() => setStaleSeen(count), 500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FIXED: count is a dependency, so the effect (and its timer) is recreated with the latest value.
  useEffect(() => {
    const id = setInterval(() => setFixedSeen(count), 500);
    return () => clearInterval(id);
  }, [count]);

  return (
    <div className="card">
      <h4>A) Stale value</h4>
      <button onClick={() => setCount(count + 1)}>+1 (count = {count})</button>
      <p>
        Timer with [] saw: <b style={{ color: "#c92a2a" }}>{staleSeen}</b> (stuck at 0)
      </p>
      <p>
        Timer with [count] saw: <b style={{ color: "#2b8a3e" }}>{fixedSeen}</b> (follows count)
      </p>
    </div>
  );
}

// ---- B) race condition -------------------------------------------------------------------
function RaceDemo() {
  const [id, setId] = useState(null);
  const [buggy, setBuggy] = useState(null);
  const [fixed, setFixed] = useState(null);

  // BUGGY: every request writes its answer, even if a newer request was started in the meantime.
  // Click User 1 (slow) then User 2 (fast): User 2 arrives first, then the old User 1 arrives and overwrites it.
  useEffect(() => {
    if (id === null) return;
    fetchUser(id).then(setBuggy);
  }, [id]);

  // FIXED: the cleanup runs when id changes, which marks the old request as "ignore".
  useEffect(() => {
    if (id === null) return;
    let ignore = false; // belongs to THIS effect run only
    fetchUser(id).then((user) => {
      if (!ignore) setFixed(user); // only the latest request is allowed to write
    });
    return () => {
      ignore = true;
    };
  }, [id]);

  return (
    <div className="card">
      <h4>B) Race condition (User 1 takes 1.5 s, User 2 takes 0.3 s)</h4>
      <button onClick={() => setId(1)}>User 1</button>
      <button onClick={() => setId(2)}>User 2</button>
      <p>Last clicked: {id ?? "none"}</p>
      <p>
        Buggy shows: <b style={{ color: "#c92a2a" }}>{buggy?.name ?? "-"}</b>
      </p>
      <p>
        Fixed shows: <b style={{ color: "#2b8a3e" }}>{fixed?.name ?? "-"}</b>
      </p>
    </div>
  );
}

// ---- C) infinite loop (explanation only, so the page does not freeze) ---------------------
//
//   const [items, setItems] = useState([]);
//   useEffect(() => {
//     setItems([...items, "x"]);   // 1) sets state ...
//   }, [items]);                   // 2) ... which changes `items`, 3) which re-runs the effect, forever.
//
// Another common cause: putting an object or array created during render in the dependency array.
//   const options = { page: 1 };            // a NEW object on every render
//   useEffect(() => { load(options) }, [options]);   // "changed" every render -> runs every render
// Fixes: depend on primitive values (options.page), move the object outside the component, or use useMemo.

export default function Demo() {
  return (
    <>
      <StaleDemo />
      <RaceDemo />
      <div className="card">
        <h4>C) Infinite loops</h4>
        <p>See the comment block above the Demo function in this file for the explanation and fixes.</p>
      </div>
    </>
  );
}
