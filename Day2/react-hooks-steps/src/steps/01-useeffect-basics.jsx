// =====================================================================================
// STEP 01 - useEffect basics: running code AFTER React has drawn the screen
//
// WHY useEffect?
//   A component's job while rendering is only to RETURN JSX from props and state. It must not
//   do other work ("side effects") such as changing the page title, fetching data, starting timers
//   or touching the browser. Those belong in useEffect, which React runs AFTER the screen was updated.
//
// TIMELINE of one update
//   1. state changes  2. component function runs (render)  3. React updates the screen  4. effects run
// =====================================================================================

import { useEffect, useState } from "react";

export const meta = {
  title: "useEffect basics",
  concept: "useEffect runs a function after React has updated the screen. Use it for work that happens outside React.",
  newInThisStep: [
    "import { useEffect } from 'react' and call it at the top level of the component",
    "useEffect(() => { ...code... }) - the function runs AFTER the render is on screen",
    "Side effects: changing document.title, fetching data, timers, subscriptions, logging",
    "Render must stay 'pure' (only compute JSX); effects are where outside work goes",
  ],
  tryThis: [
    "Open the console (F12), click the button and read the order of the two log lines",
    "Look at the browser tab title: it changes after every click",
    "Move the document.title line out of the effect and into the component body. It works, but why is it discouraged?",
  ],
};

export default function Demo() {
  const [count, setCount] = useState(0);

  // This line runs DURING render (step 1-2 of the timeline). It is just plain code in the function body.
  console.log("1. render: count is", count);

  // NEW: the effect. React calls the function you pass AFTER the screen has been updated.
  // With no second argument it runs after EVERY render (step 02 shows how to control that).
  useEffect(() => {
    console.log("2. effect: screen is updated, count is", count);
    // document.title lives OUTSIDE React: it is a browser feature. Changing it is a "side effect".
    document.title = `Clicked ${count} times`;
  });

  return (
    <div>
      <p>
        You clicked <b>{count}</b> times. Look at the browser tab title and the console.
      </p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
