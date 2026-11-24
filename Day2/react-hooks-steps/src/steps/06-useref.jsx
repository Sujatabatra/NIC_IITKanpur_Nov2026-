// =====================================================================================
// STEP 06 - useRef
//
// useRef(initial) returns an object { current: initial }. React keeps the SAME object between renders.
// Two jobs:
//   1. Hold a reference to a DOM element (<input ref={myRef} />) so you can focus it, measure it, scroll it.
//   2. Hold any value that must survive renders but must NOT trigger a re-render when it changes
//      (timer ids, previous values, render counters).
// Compare: state survives renders AND triggers a re-render; a normal variable does neither.
// =====================================================================================

import { useEffect, useRef, useState } from "react";

export const meta = {
  title: "useRef",
  concept: "A ref is a box ({ current }) that survives renders without causing them. Use it for DOM nodes and mutable values.",
  newInThisStep: [
    "const ref = useRef(null); <input ref={ref} /> then ref.current is the DOM element",
    "Changing ref.current does NOT re-render the component",
    "Store timer ids, previous values and counters in refs",
    "Never read or write ref.current for what you display (use state for that)",
  ],
  tryThis: [
    "Click 'Focus the input' and 'Start' / 'Stop' on the stopwatch",
    "Type in the input and watch 'previous value' lag one step behind",
    "Replace the stopwatch ref with a normal variable and see why Stop stops working",
  ],
};

export default function Demo() {
  // ---- 1) DOM reference -------------------------------------------------------------------
  const inputRef = useRef(null); // starts as null; React fills in the real <input> element after the first render

  // ---- 2) render counter (mutable value, no re-render) --------------------------------------
  const renders = useRef(0);
  renders.current += 1; // we only DISPLAY it; changing it does not re-render (StrictMode may count twice in dev)

  // ---- 3) previous value ------------------------------------------------------------------
  const [text, setText] = useState("");
  const previous = useRef("");
  useEffect(() => {
    // Effects run AFTER render, so during the render `previous.current` still holds the old text.
    previous.current = text;
  }, [text]);

  // ---- 4) stopwatch: the interval id lives in a ref ---------------------------------------
  const [seconds, setSeconds] = useState(0);
  const intervalId = useRef(null);
  const start = () => {
    if (intervalId.current) return; // already running
    intervalId.current = setInterval(() => setSeconds((s) => s + 1), 1000);
  };
  const stop = () => {
    clearInterval(intervalId.current);
    intervalId.current = null;
  };
  // Stop the timer if the component disappears while it is still running (cleanup, step 03).
  useEffect(() => stop, []);

  return (
    <div>
      <h4>1) DOM reference</h4>
      <input ref={inputRef} placeholder="I get focus from a button" />
      <button onClick={() => inputRef.current.focus()}>Focus the input</button>

      <h4>2) Render counter</h4>
      <p>
        This component has rendered <b>{renders.current}</b> times.
      </p>

      <h4>3) Previous value</h4>
      <input value={text} onChange={(e) => setText(e.target.value)} placeholder="type something" />
      <p>
        now: <b>{text}</b> | previous: <b>{previous.current}</b>
      </p>

      <h4>4) Stopwatch (timer id in a ref)</h4>
      <p>
        Seconds: <b>{seconds}</b>
      </p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
}
