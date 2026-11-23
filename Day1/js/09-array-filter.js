// =====================================================================================
// STEP 09 - filter(): keep only the items that pass a test
// Run:  node 09-array-filter.js
//
// WHAT YOU LEARN
//   - filter returns a NEW array containing only the items for which the callback returned true
//   - search by text, and "delete" without mutating
//   - chaining filter and map
// =====================================================================================

const staff = [
  { id: 1, name: "Asha", dept: "IT", salary: 60000 },
  { id: 2, name: "Ravi", dept: "HR", salary: 45000 },
  { id: 3, name: "Meera", dept: "IT", salary: 75000 },
];

// ---- 1) Keep matching items ---------------------------------------------------------------
// The callback returns true (keep this item) or false (drop it).
const itStaff = staff.filter((s) => s.dept === "IT");
console.log(itStaff.map((s) => s.name)); // [ 'Asha', 'Meera' ]

// ---- 2) Comparison tests --------------------------------------------------------------------
const wellPaid = staff.filter((s) => s.salary >= 60000);
console.log(wellPaid.length); // 2

// ---- 3) Search by text (the search box in step 22 uses exactly this) --------------
// Lower-case both sides so "RA" and "ra" both match.
const query = "ra";
const found = staff.filter((s) => s.name.toLowerCase().includes(query.toLowerCase()));
console.log(found.map((s) => s.name)); // [ 'Ravi', 'Meera' ]  (both names contain "ra")

// ---- 4) "Delete" an item without changing the original array ----------------------------
// Keep everything EXCEPT the one with id 2.
const afterDelete = staff.filter((s) => s.id !== 2);
console.log(afterDelete.length, staff.length); // 2 3

// ---- 5) Chaining ---------------------------------------------------------------------------------
// Each method returns an array, so you can call the next method on the result.
const itNames = staff.filter((s) => s.dept === "IT").map((s) => s.name);
console.log(itNames); // [ 'Asha', 'Meera' ]
