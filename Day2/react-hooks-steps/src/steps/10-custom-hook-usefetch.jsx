// =====================================================================================
// STEP 10 - A reusable data-fetching hook: useFetch
//
// In step 04 every component that loads data would repeat the same ~25 lines (three states, effect,
// abort, error handling). Extract it ONCE into a custom hook and reuse it everywhere:
//
//     const { data, loading, error } = useFetch(url);
//
// The `url` is a dependency, so when it changes the hook fetches again automatically.
// =====================================================================================

import { useEffect, useState } from "react";

export const meta = {
  title: "Custom hook: useFetch",
  concept: "Wrap the fetch + loading + error + cancel logic in one hook and call it from any component.",
  newInThisStep: [
    "useFetch(url) returns { data, loading, error }",
    "The url is a dependency: a new url triggers a new request (and cancels the old one)",
    "Components shrink to just the UI",
    "The hook is the place to add features later (caching, retries) for every component at once",
  ],
  tryThis: [
    "Pick different users and watch the hook fetch again",
    "Choose 'User 99 (does not exist)' to see the error path",
    "Use useFetch in a second component that lists posts (copy the pattern)",
  ],
};

// ---- the custom hook ------------------------------------------------------------------------
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(url, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError(e.message);
          setLoading(false);
        }
      });

    return () => controller.abort(); // cancel the request when the url changes or the component unmounts
  }, [url]); // the effect depends on the url

  return { data, loading, error };
}

// ---- a component that uses it: only UI code remains -------------------------------------------
export default function Demo() {
  const [id, setId] = useState(1);
  const { data: user, loading, error } = useFetch(`https://jsonplaceholder.typicode.com/users/${id}`);

  return (
    <div>
      <select value={id} onChange={(e) => setId(Number(e.target.value))}>
        <option value={1}>User 1</option>
        <option value={2}>User 2</option>
        <option value={3}>User 3</option>
        <option value={99}>User 99 (does not exist)</option>
      </select>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {user && !loading && !error && (
        <div className="card">
          <h4 style={{ margin: 0 }}>{user.name}</h4>
          <p>{user.email}</p>
          <p>{user.company?.name}</p>
        </div>
      )}
    </div>
  );
}
