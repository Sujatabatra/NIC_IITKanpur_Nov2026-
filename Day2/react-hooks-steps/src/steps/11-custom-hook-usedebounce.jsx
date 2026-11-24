// =====================================================================================
// STEP 11 - Custom hook: useDebounce (and why search boxes need it)
//
// Problem: a search box that calls an API on EVERY keystroke sends a request for "r", "ra", "rav", "ravi"...
// Debounce means: wait until the user has stopped typing for a short time, then use the final value.
//
//   const debounced = useDebounce(value, 500);   // `debounced` follows `value` 500 ms after the last change
//
// Implementation = a timer in an effect, with a CLEANUP that cancels the previous timer on every change
// (steps 03 and 06 ideas combined).
// =====================================================================================

import { useEffect, useRef, useState } from "react";

export const meta = {
  title: "Custom hook: useDebounce",
  concept: "Delay using a fast-changing value (like search text) until it settles.",
  newInThisStep: [
    "useDebounce(value, delay) returns a value that updates only after the input stops changing",
    "setTimeout in an effect + clearTimeout in the cleanup",
    "Fewer requests: compare the two request counters",
    "The effect that searches depends on the DEBOUNCED value, not the raw one",
  ],
  tryThis: [
    "Type 'meera' quickly: raw counter increases per key, debounced counter only once",
    "Change the delay to 1000 ms and see how it feels",
    "Type, pause, type again: each pause triggers one 'request'",
  ],
};

// ---- the custom hook ------------------------------------------------------------------------
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    // start a timer: after `delay` ms copy the value into debounced state
    const id = setTimeout(() => setDebounced(value), delay);
    // CLEANUP: if value changes again before the timer fires, cancel it. Only the LAST change survives.
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}

const names = ["Asha", "Ravi", "Meera", "Karan", "Sita", "Rahul", "Ritu", "Mohan"];

export default function Demo() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  // Counters (refs, so counting does not cause renders): how many "API calls" each strategy would make.
  const rawCalls = useRef(0);
  const debouncedCalls = useRef(0);
  const [, forceRender] = useState(0);

  // pretend to call an API every time the RAW text changes
  useEffect(() => {
    if (search) rawCalls.current += 1;
  }, [search]);

  // pretend to call an API only when the DEBOUNCED text changes
  useEffect(() => {
    if (debouncedSearch) {
      debouncedCalls.current += 1;
      forceRender((n) => n + 1); // refresh the display of the counter
    }
  }, [debouncedSearch]);

  // the "search result" uses the debounced text
  const results = names.filter((n) => n.toLowerCase().includes(debouncedSearch.toLowerCase()));

  return (
    <div>
      <input placeholder="Search names" value={search} onChange={(e) => setSearch(e.target.value)} />
      <p>
        Raw text: <b>{search}</b> | Debounced text (500 ms): <b>{debouncedSearch}</b>
      </p>
      <p>
        API calls if we used the raw text: <b>{rawCalls.current}</b> | with debounce: <b>{debouncedCalls.current}</b>
      </p>
      <ul>
        {results.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>
    </div>
  );
}
