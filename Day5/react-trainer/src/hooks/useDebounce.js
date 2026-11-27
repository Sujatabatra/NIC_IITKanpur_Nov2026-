import { useEffect, useState } from "react"; // state to hold the delayed value, effect to run the timer

// Returns `value`, but only after it has stopped changing for `delay` ms.
// Use: typing in a search box should not send one API request per keystroke.
export default function useDebounce(value, delay = 400) { // default delay: 400 milliseconds
  const [debounced, setDebounced] = useState(value); // starts equal to the input value
  useEffect(() => { // runs after every render in which value or delay changed
    const t = setTimeout(() => setDebounced(value), delay); // schedule the update for later
    return () => clearTimeout(t); // cleanup: if value changes again before the timer fires, cancel the old timer
  }, [value, delay]); // re-run only when one of these changes
  return debounced; // components use this instead of the raw value
}
