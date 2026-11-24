// =====================================================================================
// STEP 03 - Cleanup functions
//
// Some effects START something that keeps running: a timer, an event listener, a subscription.
// If you never stop it, it keeps running after the component disappears (a "leak") and can even
// update state of a component that no longer exists.
// An effect can RETURN a function: React calls it to clean up
//   (a) before running the effect again (when dependencies change), and
//   (b) when the component is removed from the screen (unmount).
// Rule: whatever the effect starts, the cleanup stops.
// =====================================================================================

import { useEffect, useState } from "react";

export const meta = {
  title: "Cleanup functions",
  concept: "Return a function from the effect to stop timers, listeners and subscriptions.",
  newInThisStep: [
    "return () => { ... } inside the effect is the cleanup function",
    "Cleanup runs before the effect re-runs and when the component unmounts",
    "setInterval/clearInterval and addEventListener/removeEventListener are the classic pairs",
    "StrictMode runs mount, cleanup, mount in development to expose missing cleanups",
  ],
  tryThis: [
    "Open the console and press 'Hide clock': the cleanup message appears",
    "Resize the browser window: the width updates through the listener",
    "Comment out clearInterval, hide and show the clock again, and watch the console fill with messages from old timers",
  ],
};

// A component with a timer. It is mounted and unmounted by the parent (Demo) with a button.
function Clock() {
  const [seconds, setSeconds] = useState(0);
  const [width, setWidth] = useState(window.innerWidth);

  // EFFECT 1: a timer that adds 1 every second.
  useEffect(() => {
    console.log("clock: start timer");
    const id = setInterval(() => {
      // functional update (Day 1 step 09): always based on the latest value
      setSeconds((s) => s + 1);
    }, 1000);

    // CLEANUP: stop the timer. Without this line the timer would keep running forever.
    return () => {
      console.log("clock: cleanup, stop timer");
      clearInterval(id);
    };
  }, []); // [] = start once when the component appears

  // EFFECT 2: a browser event listener.
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    // CLEANUP: remove exactly the same function that was added.
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <p>
      Clock running for <b>{seconds}</b> seconds. Window width: <b>{width}px</b>
    </p>
  );
}

export default function Demo() {
  const [show, setShow] = useState(true);
  return (
    <div>
      <button onClick={() => setShow(!show)}>{show ? "Hide clock" : "Show clock"}</button>
      {/* When show becomes false, React removes <Clock /> (unmount) and runs its cleanup functions. */}
      {show && <Clock />}
    </div>
  );
}
