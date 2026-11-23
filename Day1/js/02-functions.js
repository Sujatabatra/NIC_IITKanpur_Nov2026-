// =====================================================================================
// STEP 02 - Functions: declaration, arrow function, implicit return, default parameters
// Run:  node 02-functions.js
//
// WHAT YOU LEARN
//   - two ways to write a function and when each shape is used
//   - arrow functions and the "implicit return" shortcut
//   - returning an object from an arrow function
//   - default parameter values
//   - functions are values you can pass around (the foundation of React props and callbacks)
// =====================================================================================

// ---- 1) Classic function declaration ------------------------------------------------
// "function name(parameters) { ... return value; }"
function addOld(a, b) {
  return a + b; // return sends a value back to whoever called the function
}

// ---- 2) Arrow function with a block body -------------------------------------------
// Same idea, shorter syntax: (parameters) => { ... }. With braces you MUST write return.
const add = (a, b) => {
  return a + b;
};

// ---- 3) Arrow function with implicit return ---------------------------------------
// With no braces, the single expression after => is returned automatically.
const square = (n) => n * n; // one parameter: the parentheses are optional in other code styles

// ---- 4) Returning an object literal -------------------------------------------------
// { ... } right after => would be read as a function body, not an object.
// Wrapping the object in ( ) tells JavaScript "this is a value to return".
const makeEmployee = (name, dept) => ({ name, dept }); // { name, dept } is shorthand for { name: name, dept: dept }

// ---- 5) Default parameters -----------------------------------------------------------
// If the caller leaves the argument out (or passes undefined), the default is used.
const greet = (name = "Guest") => "Hello, " + name;

console.log(addOld(2, 3), add(2, 3), square(5)); // 5 5 25
console.log(makeEmployee("Asha", "IT")); // { name: 'Asha', dept: 'IT' }
console.log(greet(), greet("Ravi")); // Hello, Guest   Hello, Ravi

// ---- 6) Functions are values ---------------------------------------------------------
// You can store a function in a variable, pass it as an argument, or return it.
// applyTwice receives a function (fn) and calls it two times.
const applyTwice = (fn, value) => fn(fn(value));
console.log(applyTwice(square, 3)); // square(square(3)) = square(9) = 81
// React uses this everywhere: onClick={handleClick}, callbacks passed as props, array.map(fn) ...
