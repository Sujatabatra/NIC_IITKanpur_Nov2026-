// =====================================================================================
// STEP 01 - JSX basics
//
// WHAT IS JSX?
//   JSX looks like HTML but lives inside JavaScript. A React component is a function that
//   RETURNS JSX. The build tool (Vite) converts every tag into plain JavaScript calls, so the
//   browser never sees JSX.
//
// HOW THE STEPS WORK
//   Every file in src/steps/ exports:
//     - `meta`    : text shown above the demo (title, concept, what is new, things to try)
//     - `default` : the component that is shown as the live demo
// =====================================================================================

// `meta` is read by App.jsx to build the page around the demo. It is not part of the lesson itself.
export const meta = {
  title: "JSX basics",
  concept: "JSX lets you describe UI with HTML-like tags and embed JavaScript with { }.",
  newInThisStep: [
    "{ } embeds any JavaScript expression (variables, math, function calls)",
    "className instead of class, and camelCase attributes",
    "style takes an object: style={{ color: 'red' }}",
    "A component must return ONE root element (use <> </> fragments to avoid an extra div)",
  ],
  tryThis: [
    "Change the name or price and watch the page update",
    "Replace the fragment <> with a <div> and inspect the DOM in DevTools",
    "Try returning two sibling elements without a wrapper and read the error",
  ],
};

// A component = a function whose name starts with a capital letter and that returns JSX.
// `export default` lets other files import it (App.jsx imports this one).
export default function Demo() {
  // Normal JavaScript goes ABOVE the return. These values are used inside the JSX below.
  const name = "Asha";
  const price = 499;
  const tags = ["react", "jsx"];

  return (
    // <> ... </> is a "fragment": a wrapper that adds NO extra element to the page.
    // A component may return only ONE root element, so siblings must be wrapped (div or fragment).
    <>
      {/* Comments inside JSX must be written like this: curly braces around a normal comment. */}

      {/* className (not class) because "class" is a reserved word in JavaScript.
          style takes a JavaScript OBJECT, hence two pairs of braces:
          the outer {} means "JavaScript expression", the inner {} is the object. CSS names are camelCase (fontSize). */}
      <h2 className="title" style={{ color: "#0e7490", fontSize: 22 }}>
        {/* { } runs JavaScript and inserts the result: here a method call on a variable */}
        Hello, {name.toUpperCase()}!
      </h2>

      <p>
        {/* Any expression works: math, method calls. (Statements like if/for do not.) */}
        2 + 3 = {2 + 3}. Price with GST: {(price * 1.18).toFixed(2)}
      </p>

      {/* Arrays of strings are joined by our code first, because we choose how they appear */}
      <p>Tags: {tags.join(", ")}</p>

      {/* HTML attributes become camelCase props: maxlength -> maxLength.
          Numbers and other non-string values go inside { } (maxLength={30}). */}
      {/* Tags with no children must be self-closed: <input />, <br /> */}
      <input placeholder="attributes are camelCase, e.g. maxLength" maxLength={30} style={{ width: 320 }} />
      <br />

      {/* htmlFor replaces the HTML attribute "for" (also a reserved word in JavaScript) */}
      <label htmlFor="agree">
        <input id="agree" type="checkbox" /> htmlFor replaces for
      </label>
    </>
  );
}
