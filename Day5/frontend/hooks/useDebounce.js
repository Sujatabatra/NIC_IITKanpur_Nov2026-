// hooks/useDebounce.js - a CUSTOM HOOK: reusable logic that uses other hooks.
//
// Problem: the search box changes on every keystroke. Calling the API for each letter ("a", "al", "ali"...)
// wastes requests. Debouncing = "wait until the user stops typing for `delay` ms, then use the latest value".
//
// This file has no "use client" because a hook is not a component; it works wherever a client component imports it.
import { useEffect, useState } from "react";

export default function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value); // the slow-moving copy of `value`

  useEffect(() => {
    // start a timer; when it fires, copy the latest value into `debounced`
    const t = setTimeout(() => setDebounced(value), delay);
    // CLEANUP: React runs this before the next effect (the user typed again) and when the component
    // disappears. It cancels the old timer, so only the LAST keystroke's timer survives.
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}
