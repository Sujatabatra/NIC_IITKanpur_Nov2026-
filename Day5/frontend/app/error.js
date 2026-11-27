"use client"; // error boundaries MUST be client components (they use state to recover)

// app/error.js - NEW TOPIC (not in Day 2): the automatic error screen.
//
// If a component below throws while rendering, React would normally show a blank page. A file named
// error.js catches that error for its segment and shows this fallback instead; the rest of the layout
// (the navbar) stays alive. Next.js passes two props:
//   error  - the Error object that was thrown
//   reset  - a function that tries to render the segment again
// Errors thrown inside event handlers or async code (like a failed axios call) are NOT caught here;
// we handle those with try/catch and an `error` state (see EmployeeForm).
export default function GlobalError({ error, reset }) {
  return (
    <div className="container">
      <div className="card">
        <h2>Something went wrong</h2>
        <p className="error">{error.message}</p>
        <button className="btn" onClick={reset}>
          Try again
        </button>
      </div>
    </div>
  );
}
