// =====================================================================================
// STEP 04 - Fetching data from an API with useEffect
//
// The most common use of useEffect. Pattern:
//   1. Keep THREE pieces of state: data, loading, error.
//   2. In the effect, call fetch, and set the state when the request finishes (or fails).
//   3. In the JSX show a different screen for loading, error and success.
//   4. Cancel the request in the cleanup with an AbortController (so a slow, old request cannot
//      overwrite newer data or update an unmounted component).
// =====================================================================================

import { useEffect, useState } from "react";

export const meta = {
  title: "Fetching data",
  concept: "Fetch inside useEffect and model the request as loading, error and success.",
  newInThisStep: [
    "Three states: data, loading, error",
    "async code inside the effect (the effect function itself cannot be async)",
    "Check res.ok: fetch only rejects on network failure, not on HTTP 404/500",
    "AbortController + cleanup cancels the request; ignore the resulting AbortError",
    "A 'reload' counter in the dependency array re-runs the effect on demand",
  ],
  tryThis: [
    "Press Reload and watch 'Loading...' appear again",
    "Tick 'Use a wrong URL' and press Reload to see the error screen",
    "Open DevTools > Network > throttle to Slow 3G and press Reload",
  ],
};

export default function Demo() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(0); // changing this number re-runs the effect
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    // AbortController lets us cancel a request that is still in flight.
    const controller = new AbortController();

    // The effect function cannot be async (it must return nothing or a cleanup function),
    // so we create an async function inside it and call it right away.
    async function load() {
      setLoading(true); // show the spinner for every (re)load
      setError(null);
      try {
        const url = broken ? "https://jsonplaceholder.typicode.com/wrong-url" : "https://jsonplaceholder.typicode.com/users?_limit=5";
        const res = await fetch(url, { signal: controller.signal });
        // fetch only throws for network problems. A 404 or 500 still "succeeds", so check res.ok ourselves.
        if (!res.ok) throw new Error(`Server answered with HTTP ${res.status}`);
        setUsers(await res.json());
      } catch (e) {
        // When we abort on purpose the error name is AbortError: that is not a real problem, ignore it.
        if (e.name !== "AbortError") setError(e.message);
      } finally {
        // finally runs after success OR failure; but not when we were aborted (component is going away)
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    load();

    // CLEANUP: runs when the component unmounts or before the effect runs again (reload changed).
    return () => controller.abort();
  }, [reload, broken]); // re-run when the user presses Reload or toggles the wrong-URL checkbox

  return (
    <div>
      <button onClick={() => setReload((n) => n + 1)}>Reload</button>{" "}
      <label>
        <input type="checkbox" checked={broken} onChange={(e) => setBroken(e.target.checked)} /> Use a wrong URL
      </label>

      {/* One piece of JSX for each of the three situations */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && (
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.name} - {u.email}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
