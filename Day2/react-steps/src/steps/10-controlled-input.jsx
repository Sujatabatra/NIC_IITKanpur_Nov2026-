// =====================================================================================
// STEP 10 - Controlled inputs
//
// CONTROLLED INPUT: React state holds the value, and the input just DISPLAYS it.
//   typing -> onChange -> setState -> re-render -> input shows the new state value
// State is the "single source of truth", so you can validate, transform or reset the text anytime.
// (The alternative is an UNCONTROLLED input: the browser keeps the value and you read it on demand.)
// =====================================================================================

// useRef gives a "box" (ref.current) that survives re-renders but does NOT cause them.
import { useRef, useState } from "react";

export const meta = {
  title: "Controlled input",
  concept: "In a controlled input, React state is the single source of truth for the value.",
  newInThisStep: [
    "value={name} + onChange={(e) => setName(e.target.value)}",
    "Derived output from state: the greeting and the character count",
    "Uncontrolled alternative: let the DOM keep the value and read it with a ref",
    "Without onChange, a controlled input becomes read-only",
  ],
  tryThis: [
    "Type in both inputs and compare how they update",
    "Remove the onChange from the controlled input and try typing",
    "Add a 'Clear' button that calls setName('')",
  ],
};

export default function Demo() {
  // State for the controlled input
  const [name, setName] = useState("");

  // NEW: a ref to a DOM element. Attached with ref={inputRef}; afterwards inputRef.current is the real <input>.
  const inputRef = useRef(null);
  const [readFromRef, setReadFromRef] = useState("");

  return (
    <div>
      <h4>Controlled</h4>
      {/* value={name}: the input always shows what is in state.
          onChange: on every keystroke, copy the typed text (e.target.value) into state.
          If you leave out onChange, typing does nothing, because state never changes. */}
      <input placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      {/* Because the text is in state, we can use it anywhere while typing */}
      <p>
        {name ? `Hello, ${name}!` : "Type your name"} ({name.length} characters)
      </p>

      <h4>Uncontrolled (ref)</h4>
      {/* No value/onChange: the browser owns the text. We only look at it when asked (button click). */}
      <input ref={inputRef} placeholder="Type, then press the button" defaultValue="" />
      <button onClick={() => setReadFromRef(inputRef.current.value)}>Read value</button>
      <p>Value read from the DOM: {readFromRef}</p>
    </div>
  );
}
