// =====================================================================================
// STEP 06 - Spread operator: copy, merge and "immutable updates"
// Run:  node 06-spread.js
//
// WHAT YOU LEARN
//   - copying arrays and objects with ...
//   - merging, and overriding one field while keeping the rest
//   - the add / update / delete patterns React state requires (never mutate the original)
//   - the "shallow copy" trap
// =====================================================================================

// ---- 1) Copy an array ------------------------------------------------------------------
// "...original" spreads the items out into a new array. `copy` is a different array.
const original = [1, 2, 3];
const copy = [...original];
copy.push(4); // changing the copy...
console.log(original, copy); // [ 1, 2, 3 ] [ 1, 2, 3, 4 ]   ...does not touch the original

// ---- 2) Merge arrays ------------------------------------------------------------------
const merged = [...[1, 2], ...[3, 4]];
console.log(merged); // [ 1, 2, 3, 4 ]

// ---- 3) Copy an object and override one field ---------------------------------------
// Properties are copied first, then dept: "HR" replaces the copied dept (later keys win).
const employee = { id: 1, name: "Asha", dept: "IT" };
const moved = { ...employee, dept: "HR" };
console.log(employee.dept, moved.dept); // IT HR (original unchanged)

// Later keys win, and new keys can be added at the same time.
console.log({ ...employee, name: "Asha Verma", city: "Kanpur" });

// ---- 4) The pattern you will use constantly in React ------------------------------------
// React compares the OLD state with the NEW state to decide whether to re-render.
// If you change an array in place (push, splice...), it is the same array, so React may miss the change.
// Always build a NEW array/object instead:
const list = [
  { id: 1, name: "Asha" },
  { id: 2, name: "Ravi" }
];
const added = [...list, { id: 3, name: "Meera" }]; // ADD:    old items + one more
const updated = list.map((e) => (e.id === 2 ? { ...e, name: "Ravi K" } : e)); // UPDATE: replace one item
const removed = list.filter((e) => e.id !== 1); // DELETE: keep everything except one
console.log(added.length, updated[1].name, removed.length); // 3 Ravi K 1
console.log(list.length); // 2 -> the original array never changed

// ---- 5) The shallow-copy trap ------------------------------------------------------------
// Spread copies only the FIRST level. Nested objects are still shared between the copies.
const nested = { name: "A", address: { city: "Kanpur" } };
const shallow = { ...nested };
shallow.address.city = "Delhi"; // changes the shared inner object
console.log(nested.address.city); // Delhi  (careful! copy the nested object too when you change it)
