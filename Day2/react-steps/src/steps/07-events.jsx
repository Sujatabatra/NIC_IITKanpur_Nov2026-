// =====================================================================================
// STEP 07 - Handling events
//
// Events are user actions: click, typing, submitting a form. You attach a FUNCTION to an event
// with props like onClick / onChange / onSubmit, and React calls it when the event happens.
// This step has no state yet, so the screen does not change; open the console (F12) to see output.
// =====================================================================================

export const meta = {
  title: "Events",
  concept: "Pass a function to onClick, onChange, onSubmit... React calls it when the event happens.",
  newInThisStep: [
    "onClick={handleClick}: pass the function itself, do NOT call it (not handleClick())",
    "The handler receives an event object (e.target, e.preventDefault())",
    "Pass arguments with an arrow function: onClick={() => remove(id)}",
    "onChange fires on every keystroke of an input",
  ],
  tryThis: [
    "Open the browser console (F12) and click the buttons",
    "Type in the input and watch e.target.value in the console",
    "Change onClick={handleClick} to onClick={handleClick()} and see what breaks",
  ],
};

export default function Demo() {
  // Event handlers are ordinary functions defined inside the component.
  const handleClick = () => {
    console.log("button clicked");
  };

  // React gives the handler an EVENT object. e.target is the element that fired it,
  // and for an input, e.target.value is the text currently typed.
  const handleChange = (e) => {
    console.log("typed:", e.target.value);
  };

  // A handler with its own parameter. It cannot be passed directly (React would call it with the event),
  // so the button wraps it in an arrow function (see below).
  const remove = (id) => {
    console.log("remove employee", id);
  };

  return (
    <div>
      {/* Pass the FUNCTION ITSELF. handleClick() with parentheses would run it during rendering. */}
      <button onClick={handleClick}>Click me</button>

      {/* Need to pass an argument? Wrap the call in an arrow function: it runs only on click. */}
      <button onClick={() => remove(7)}>Remove employee 7</button>

      {/* An inline handler can also receive the event object */}
      <button onClick={(e) => console.log("event type:", e.type)}>Show event</button>

      <p>
        {/* onChange fires on every keystroke */}
        <input placeholder="type here (see console)" onChange={handleChange} />
      </p>

      {/* A form's submit event normally reloads the page.
          e.preventDefault() cancels that default browser behaviour so React can handle the submit. */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          console.log("form submitted without a page reload");
        }}
      >
        <button type="submit">Submit form</button>
      </form>
    </div>
  );
}
