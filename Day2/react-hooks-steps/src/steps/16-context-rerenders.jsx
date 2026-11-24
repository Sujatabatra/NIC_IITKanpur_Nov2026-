// =====================================================================================
// STEP 16 - Context and re-renders (the limits of Context)
//
// FACT: when a Provider's `value` changes, EVERY component that calls useContext for it re-renders,
// even if it only uses a part of the value that did not change.
// Also: `value={{ a, b }}` creates a NEW object on every render of the Provider, which counts as a
// change for all consumers.
//
// Ways to limit the damage:
//   1. Split one big context into several small ones (state vs actions, or one per concern).
//   2. Memoise the value object (useMemo) so it only changes when its contents change.
//   3. For large, fast-changing global state use a library with selectors (Redux Toolkit, Recoil, Zustand).
// =====================================================================================

import { createContext, memo, useContext, useMemo, useRef, useState } from "react";

export const meta = {
  title: "Context re-renders and how to limit them",
  concept: "All consumers re-render when the context value changes. Split contexts or memoise to reduce work.",
  newInThisStep: [
    "Render counters show which consumers re-rendered",
    "Single context: changing the counter also re-renders the component that only reads the name",
    "Split contexts: each consumer re-renders only for its own value",
    "useMemo on the value object avoids needless changes when the Provider re-renders for other reasons",
  ],
  tryThis: [
    "In 'One context', click '+1 count' and watch BOTH counters rise",
    "In 'Split contexts', click '+1 count': only the count reader's counter rises",
    "Wrap SplitNameReader in plain function (remove memo) and see that it re-renders only because its parent re-renders, not because of context",
  ],
};

function useRenderCount() {
  const r = useRef(0);
  r.current += 1;
  return r.current;
}

// =========== Version 1: ONE context holding two unrelated values ===========================
const BigContext = createContext(null);

function BigProvider({ children }) {
  const [count, setCount] = useState(0);
  const [name] = useState("Asha");
  // A new object every render of BigProvider: every consumer sees "a change" each time.
  return <BigContext.Provider value={{ count, setCount, name }}>{children}</BigContext.Provider>;
}
function BigCountReader() {
  const { count, setCount } = useContext(BigContext);
  const r = useRenderCount();
  return (
    <p>
      count reader (render #{r}): {count} <button onClick={() => setCount(count + 1)}>+1 count</button>
    </p>
  );
}
function BigNameReader() {
  const { name } = useContext(BigContext); // only needs name, but re-renders whenever count changes
  const r = useRenderCount();
  return <p>name reader (render #{r}): {name}</p>;
}

// =========== Version 2: SPLIT into two contexts ============================================
const CountContext = createContext(null);
const NameContext = createContext(null);

function SplitProvider({ children }) {
  const [count, setCount] = useState(0);
  const [name] = useState("Asha");
  // useMemo: the value object only changes when count changes
  const countValue = useMemo(() => ({ count, setCount }), [count]);
  return (
    <CountContext.Provider value={countValue}>
      <NameContext.Provider value={name}>{children}</NameContext.Provider>
    </CountContext.Provider>
  );
}
function SplitCountReader() {
  const { count, setCount } = useContext(CountContext);
  const r = useRenderCount();
  return (
    <p>
      count reader (render #{r}): {count} <button onClick={() => setCount(count + 1)}>+1 count</button>
    </p>
  );
}
// memo + a context the component does NOT read: it is not re-rendered by count changes.
const SplitNameReader = memo(function SplitNameReader() {
  const name = useContext(NameContext);
  const r = useRenderCount();
  return <p>name reader (render #{r}): {name}</p>;
});

export default function Demo() {
  return (
    <div>
      <div className="card">
        <h4>One context (both readers re-render)</h4>
        <BigProvider>
          <BigCountReader />
          <BigNameReader />
        </BigProvider>
      </div>
      <div className="card">
        <h4>Split contexts (only the count reader re-renders)</h4>
        <SplitProvider>
          <SplitCountReader />
          <SplitNameReader />
        </SplitProvider>
      </div>
    </div>
  );
}
