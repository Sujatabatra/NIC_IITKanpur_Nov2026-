// =====================================================================================
// STEP 12 - Callback functions and asynchronous code
// Run:  node 12-callbacks.js
//
// WHAT YOU LEARN
//   - a callback is a function you hand to another function to be called later
//   - JavaScript does not wait: slow work finishes later and calls your callback
//   - the Node convention callback(error, result)
//   - why nested callbacks are a problem ("callback hell"), which promises solve (step 13)
// =====================================================================================

// ---- 1) Synchronous callback: called immediately --------------------------------------------
// doTwice receives a function and calls it two times. (array.map and onClick use the same idea.)
const doTwice = (fn) => {
  fn();
  fn();
};
doTwice(() => console.log("hello")); // hello, hello

// ---- 2) Asynchronous callback: called LATER, when the work is done --------------------------
// setTimeout pretends to be a slow database or network call: it waits 300ms, then runs the function.
function fetchEmployee(id, callback) {
  setTimeout(() => {
    // Node convention: the FIRST argument is an error (or null), the SECOND is the result.
    if (id === 0) callback(new Error("Invalid id"), null);
    else callback(null, { id, name: "Asha" });
  }, 300);
}

fetchEmployee(1, (err, emp) => {
  if (err) return console.error("error:", err.message); // always check for the error first
  console.log("callback result:", emp);
});
fetchEmployee(0, (err) => console.error("callback error:", err.message));

// This line runs BEFORE the callbacks above, because JavaScript does not stop and wait.
console.log("I print BEFORE the callbacks: JavaScript does not wait");

// ---- 3) The problem: callback hell ---------------------------------------------------------------------
// Three dependent calls force three levels of nesting. Imagine ten, plus error handling at each level.
// Step 13 shows how promises flatten this.
fetchEmployee(1, (e1, a) => {
  fetchEmployee(2, (e2, b) => {
    fetchEmployee(3, (e3, c) => {
      console.log("three nested callbacks:", a.id, b.id, c.id);
    });
  });
});
