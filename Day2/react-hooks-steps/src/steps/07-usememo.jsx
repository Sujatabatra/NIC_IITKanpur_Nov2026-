// =====================================================================================
// STEP 07 - useMemo: remember the result of an expensive calculation
//
// Remember (Day 1 step 20): every time state changes, the component function runs again and EVERYTHING
// inside it is recalculated, even values that did not change. Usually that is fast. When a calculation
// is genuinely slow, you can remember its result:
//
//   const result = useMemo(() => slowCalculation(n), [n]);
//
// React re-runs slowCalculation only when `n` changed; otherwise it returns the remembered result.
// IMPORTANT: useMemo is an optimisation, not a requirement. Measure first; do not wrap everything.
// =====================================================================================

import { useMemo, useState } from "react";

export const meta = {
  title: "useMemo",
  concept: "useMemo caches the result of a slow calculation until its dependencies change.",
  newInThisStep: [
    "const value = useMemo(() => compute(a, b), [a, b])",
    "The function runs on the first render and again only when a dependency changed",
    "Without it, unrelated state changes (like typing) repeat the slow work on every keystroke",
    "Use it for genuinely expensive work; measure before optimising",
  ],
  tryThis: [
    "Tick 'Use useMemo' off and type in the text box: it feels laggy because the slow sum is recomputed every key press",
    "Tick it on and type again: smooth, and the console shows the sum is not recomputed",
    "Change the number to a larger one to make the difference bigger",
  ],
};

// A deliberately slow function: adds the numbers from 1 to n (a big loop).
function slowSum(n) {
  const start = performance.now();
  let total = 0;
  for (let i = 1; i <= n; i++) total += i;
  console.log(`slowSum(${n}) computed in ${(performance.now() - start).toFixed(1)} ms`);
  return total;
}

export default function Demo() {
  const [n, setN] = useState(30_000_000);
  const [text, setText] = useState(""); // unrelated state: typing re-renders the whole component
  const [useMemoOn, setUseMemoOn] = useState(true);

  // Without memo: runs on EVERY render (also when only `text` changed).
  // With memo: runs only when n changes.
  // Both versions are written out so you can compare them. The memo hook is ALWAYS called (rules of hooks, step 12);
  // we just choose which result to display.
  const memoized = useMemo(() => slowSum(n), [n]);
  const plain = useMemoOn ? null : slowSum(n);
  const sum = useMemoOn ? memoized : plain;

  return (
    <div>
      <label>
        <input type="checkbox" checked={useMemoOn} onChange={(e) => setUseMemoOn(e.target.checked)} /> Use useMemo
      </label>
      <p>
        Sum of 1 to{" "}
        <select value={n} onChange={(e) => setN(Number(e.target.value))}>
          <option value={10_000_000}>10 million</option>
          <option value={30_000_000}>30 million</option>
          <option value={100_000_000}>100 million</option>
        </select>{" "}
        = <b>{sum.toLocaleString("en-IN")}</b>
      </p>
      <p>
        <input placeholder="type here and feel the lag when memo is off" value={text} onChange={(e) => setText(e.target.value)} style={{ width: 340 }} />
      </p>
      <p>
        <small>Open the console to see how often slowSum runs.</small>
      </p>
    </div>
  );
}
