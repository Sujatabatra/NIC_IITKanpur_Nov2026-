// =====================================================================================
// App.jsx - the "step navigator" (this file is NOT one of the lessons)
//
// It finds every file in src/steps/, sorts them by name (01-..., 02-..., ...), and shows for the
// selected step: what is new, the live demo, things to try and the step's own source code.
// You can learn React from src/steps/*.jsx without reading this file.
// =====================================================================================

import { useEffect, useState } from "react";

// import.meta.glob is a Vite feature: it imports many files matching a pattern.
//   `modules` -> the step modules themselves (their default component + `meta`)
//   `sources` -> the same files imported as RAW TEXT ("?raw"), so we can print their source code
// { eager: true } loads them immediately instead of on demand.
const modules = import.meta.glob("./steps/*.jsx", { eager: true });
const sources = import.meta.glob("./steps/*.jsx", { query: "?raw", import: "default", eager: true });

// Turn the glob objects into an ordered array: [{ file, Demo, meta, source }, ...]
const steps = Object.keys(modules)
  .sort() // "./steps/01-..." sorts before "./steps/02-...", so the order is the file-name order
  .map((path) => ({
    file: path.split("/").pop(), // "08-usestate-counter.jsx"
    Demo: modules[path].default, // the demo component (a capitalised variable, so JSX can render it)
    meta: modules[path].meta, // title, concept, newInThisStep, tryThis
    source: sources[path], // the file's text
  }));

// The selected step is remembered in the URL (#step=8), so a refresh or a shared link opens the same step.
const readHash = () => {
  const n = parseInt(window.location.hash.replace("#step=", ""), 10);
  return Number.isInteger(n) && n >= 1 && n <= steps.length ? n - 1 : 0; // fall back to the first step
};

export default function App() {
  // State: the index of the selected step. Passing a function (readHash) means it runs only once.
  const [index, setIndex] = useState(readHash);

  // Whenever the step changes: update the URL hash and scroll back to the top of the page.
  useEffect(() => {
    window.location.hash = `step=${index + 1}`;
    window.scrollTo(0, 0);
  }, [index]);

  // Destructure the current step. `Demo` starts with a capital letter, so JSX treats <Demo /> as a component.
  const { Demo, meta, source, file } = steps[index];

  return (
    <div className="shell">
      {/* ---- left menu: one button per step ---- */}
      <aside className="side">
        <h2>Day 1: step by step</h2>
        <p>JSX, components, props, state, forms, lists, rendering</p>
        {steps.map((s, i) => (
          // key = unique file name; the button is highlighted when it is the selected step
          <button key={s.file} className={i === index ? "on" : ""} onClick={() => setIndex(i)}>
            {String(i + 1).padStart(2, "0")}. {s.meta.title}
          </button>
        ))}
      </aside>

      <main className="main">
        {/* ---- previous / next buttons (disabled at the ends) ---- */}
        <div className="pager">
          <button disabled={index === 0} onClick={() => setIndex(index - 1)}>
            ← Previous
          </button>
          <span>
            Step {index + 1} of {steps.length}
          </span>
          <button disabled={index === steps.length - 1} onClick={() => setIndex(index + 1)}>
            Next →
          </button>
        </div>

        <h1>
          {String(index + 1).padStart(2, "0")}. {meta.title}
        </h1>
        <p className="lead">{meta.concept}</p>

        {/* ---- what is new in this step ---- */}
        <div className="card new">
          <b>New in this step</b>
          <ul>
            {meta.newInThisStep.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>

        <h3>Live demo</h3>
        {/* key={file} makes React treat each step as a brand-new component instance,
            so the demo's state is reset when you move to another step. */}
        <div className="demo">
          <Demo key={file} />
        </div>

        <h3>Try this</h3>
        <ol className="try">
          {meta.tryThis.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>

        {/* ---- the step's source code, with all its explanation comments ---- */}
        <h3>
          Source: <code>src/steps/{file}</code>
        </h3>
        <pre className="src">{source}</pre>
      </main>
    </div>
  );
}
