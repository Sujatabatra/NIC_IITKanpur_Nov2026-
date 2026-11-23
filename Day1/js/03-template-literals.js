// =====================================================================================
// STEP 03 - Template literals
// Run:  node 03-template-literals.js
//
// WHAT YOU LEARN
//   - building strings with backticks and ${ } instead of "+" concatenation
//   - putting any JavaScript expression inside a string
//   - multi-line strings
//   - building URLs (you will do this when calling APIs on later days)
// =====================================================================================

const name = "Asha";
const dept = "IT";
const salary = 60000;

// ---- 1) The old way: concatenation with + --------------------------------------------
// Works, but it is easy to forget a space or a quote as strings get longer.
console.log("Employee " + name + " works in " + dept + ".");

// ---- 2) Template literal: use `backticks` and ${ } --------------------------------
// Everything inside ${ } is evaluated as JavaScript and inserted into the text.
console.log(`Employee ${name} works in ${dept}.`);

// ---- 3) Any expression works ----------------------------------------------------------
// Math, comparisons, ternaries (condition ? a : b), function calls ...
console.log(`Annual salary: ${salary * 12} (${salary > 50000 ? "senior band" : "junior band"})`);

// ---- 4) Multi-line strings -------------------------------------------------------------
// New lines inside the backticks are kept exactly as typed.
const message = `Dear ${name},
Your department is ${dept}.
Regards, HR`;
console.log(message);

// ---- 5) Building URLs --------------------------------------------------------------------
// encodeURIComponent makes a value safe to put in a URL (spaces, &, ? ...).
const id = 7;
console.log(`/api/employees/${id}?dept=${encodeURIComponent(dept)}`);
