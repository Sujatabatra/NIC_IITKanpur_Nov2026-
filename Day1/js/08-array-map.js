// =====================================================================================
// STEP 08 - map(): transform every item into something else
// Run:  node 08-array-map.js
//
// WHAT YOU LEARN
//   - map takes an array and returns a NEW array of the same length
//   - the callback decides what each new item looks like
//   - the optional second argument (index)
//   - how this becomes "render a list" in React
// =====================================================================================

const staff = [
  { id: 1, name: "Asha", dept: "IT", salary: 60000 },
  { id: 2, name: "Ravi", dept: "HR", salary: 45000 },
  { id: 3, name: "Meera", dept: "IT", salary: 75000 },
];

// ---- 1) Pick one field from every object ----------------------------------------------
// The callback runs once per item; whatever it returns becomes the item in the new array.
const names = staff.map((s) => s.name);
console.log(names); // [ 'Asha', 'Ravi', 'Meera' ]

// ---- 2) Build new objects (without changing the old ones) -------------------------
// { ...s, salary: ... } copies the employee and overrides only the salary.
const withBonus = staff.map((s) => ({ ...s, salary: s.salary * 1.1 }));
console.log(withBonus[0].salary, staff[0].salary); // 66000 60000 -> the original is unchanged

// ---- 3) The index is the second callback argument ---------------------------------------
const labels = staff.map((s, index) => `${index + 1}. ${s.name} (${s.dept})`);
console.log(labels); // [ '1. Asha (IT)', '2. Ravi (HR)', '3. Meera (IT)' ]

// React preview: render a list by mapping data to JSX elements
//   {staff.map((s) => <li key={s.id}>{s.name}</li>)}
