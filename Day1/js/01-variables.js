// =====================================================================================
// STEP 01 - let, const (and why we avoid var)
// Run:  node 01-variables.js
//
// WHAT YOU LEARN
//   - how to store a value in a named "variable"
//   - the difference between const, let and the old var
//   - what "block scope" means
//   - why const does not mean "frozen"
// =====================================================================================

// ---- 1) const: a name that can never be pointed at a different value ----------------
// Use const for anything that does not need to be reassigned (most things).
const company = "IITK";
// company = "other"; // <- uncomment to see: TypeError: Assignment to constant variable.

// ---- 2) let: a name whose value may change later -----------------------------------
let count = 0; // start at 0
count = count + 1; // reassign: count is now 1
count++; // shorthand for count = count + 1: count is now 2
console.log(company, count); // IITK 2

// ---- 3) Block scope ----------------------------------------------------------------
// A "block" is anything between { and }. let and const only exist inside the block
// where they are declared. This prevents accidental clashes between different parts of a program.
if (true) {
  let inside = "only in this block";
  const alsoInside = 42;
  console.log(inside, alsoInside); // works here...
}
// console.log(inside); // ...but outside: ReferenceError: inside is not defined

// ---- 4) var: the old keyword (avoid it) --------------------------------------------
// var ignores block scope and "leaks" out of the if-block. This causes surprising bugs,
// which is why modern JavaScript uses let and const instead.
if (true) {
  var leaked = "visible outside the block";
}
console.log(leaked); // visible outside the block

// ---- 5) const is not "immutable" ----------------------------------------------------
// const only stops you from re-pointing the NAME to a new value. If the value is an object
// or array, its contents can still be changed.
const employee = { name: "Asha" };
employee.name = "Asha Verma"; // allowed: we changed a property, not the variable itself
const list = [1, 2];
list.push(3); // allowed: we changed the array's contents
console.log(employee, list); // { name: 'Asha Verma' } [ 1, 2, 3 ]
// NOTE: in React we will still treat state as read-only and always create NEW objects/arrays (step 06).

// RULE OF THUMB: use const by default; use let only when you know the value must change.
