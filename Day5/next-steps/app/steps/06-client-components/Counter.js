"use client";
// Counter.js - a Client Component. The line above must be the first statement in the file.
// Everything this file imports also becomes client code, so keep client components small.

import { useState } from "react";

// Props arrive from the Server Component (page.js). They are copied (serialized) to the browser,
// so functions and class instances cannot be passed from server to client, only plain data.
export default function Counter({ initial, renderedOnServerAt }) {
  const [count, setCount] = useState(initial); // allowed here: this is a Client Component

  return (
    <div className="card">
      <p>
        Client Component. Server rendered the first HTML at <b>{renderedOnServerAt}</b>.
      </p>
      <p>
        Count: <b>{count}</b>
      </p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(initial)}>Reset to {initial}</button>
    </div>
  );
}
