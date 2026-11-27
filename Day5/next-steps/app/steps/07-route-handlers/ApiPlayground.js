"use client";
// ApiPlayground.js - a Client Component with buttons that call our own API and show the raw result.
// It makes the HTTP verbs, status codes and JSON bodies visible.

import { useState } from "react";

export default function ApiPlayground() {
  const [result, setResult] = useState(null);
  const [name, setName] = useState("Karan");

  // One helper that sends a request and stores status + body so we can display them.
  async function call(label, url, options) {
    const res = await fetch(url, options);
    // DELETE returns 204 with an empty body, so only parse JSON when there is content.
    const text = await res.text();
    setResult({ label, status: res.status, body: text ? JSON.parse(text) : "(empty body)" });
  }

  const json = (method, data) => ({ method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });

  return (
    <div className="demo">
      <p>
        <button onClick={() => call("GET list", "/api/steps/employees")}>GET list</button>
        <button onClick={() => call("GET IT only", "/api/steps/employees?department=IT")}>GET ?department=IT</button>
        <button onClick={() => call("GET one", "/api/steps/employees/1")}>GET /1</button>
        <button onClick={() => call("GET missing", "/api/steps/employees/999")}>GET /999 (404)</button>
      </p>
      <p>
        <input value={name} onChange={(e) => setName(e.target.value)} />
        <button onClick={() => call("POST create", "/api/steps/employees", json("POST", { name, department: "IT" }))}>POST create</button>
        <button onClick={() => call("POST invalid", "/api/steps/employees", json("POST", { name: "" }))}>POST invalid (400)</button>
      </p>
      <p>
        <button onClick={() => call("PATCH 1", "/api/steps/employees/1", json("PATCH", { department: "Finance" }))}>PATCH /1</button>
        <button onClick={() => call("DELETE 2", "/api/steps/employees/2", { method: "DELETE" })}>DELETE /2</button>
      </p>
      <pre>{result ? `${result.label}\nstatus: ${result.status}\n${JSON.stringify(result.body, null, 2)}` : "Press a button"}</pre>
    </div>
  );
}
