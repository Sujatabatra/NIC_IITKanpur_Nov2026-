// =====================================================================================
// STEP 10 - find() and friends: get a single match
// Run:  node 10-array-find.js
//
// WHAT YOU LEARN
//   - find returns ONE item (the first match) instead of an array
//   - what happens when nothing matches, and how to handle it safely
//   - findIndex, some, every, includes
// =====================================================================================

const staff = [
  { id: 1, name: "Asha", dept: "IT", salary: 60000 },
  { id: 2, name: "Ravi", dept: "HR", salary: 45000 },
  { id: 3, name: "Meera", dept: "IT", salary: 75000 },
];

// ---- 1) First match, or undefined --------------------------------------------------------
console.log(staff.find((s) => s.id === 2)); // Ravi's object
console.log(staff.find((s) => s.id === 99)); // undefined (nothing matched)

// ---- 2) Always handle "not found" ---------------------------------------------------------
// Reading a property of undefined crashes the program, so check first.
const emp = staff.find((s) => s.id === 99);
console.log(emp ? emp.name : "Employee not found");
// ?. (optional chaining) returns undefined instead of crashing; ?? gives a fallback value.
console.log(emp?.name ?? "optional chaining: no crash");

// ---- 3) Related helpers --------------------------------------------------------------------------
console.log(staff.findIndex((s) => s.name === "Meera")); // 2    -> position of the first match (or -1)
console.log(staff.some((s) => s.salary > 70000)); // true  -> at least ONE item passes
console.log(staff.every((s) => s.salary > 50000)); // false -> ALL items must pass
console.log(staff.includes(staff[0])); // true  -> same object reference is in the array
