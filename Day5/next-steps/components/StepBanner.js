// components/StepBanner.js - a small shared component used by every lesson page.
// It only prints the lesson number, title, a one-line concept and a list of "new in this step" points.
// This file is NOT a lesson. It is a normal Server Component (no "use client", no hooks).

export default function StepBanner({ number, title, concept, points = [], path }) {
  return (
    <div className="banner">
      <h1>
        Step {number}: {title}
      </h1>
      <p style={{ margin: "4px 0" }}>{concept}</p>
      {path && (
        <p style={{ margin: "4px 0" }}>
          URL: <code>{path}</code>
        </p>
      )}
      {points.length > 0 && (
        <>
          <b>New in this step</b>
          <ul>
            {points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
