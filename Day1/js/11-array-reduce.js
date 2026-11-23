// =====================================================================================
// STEP 11 - reduce(): combine many items into ONE value
// Run:  node 11-array-reduce.js
//
// WHAT YOU LEARN
//   - the accumulator idea: carry a running result while walking through the array
//   - totals, averages, maximum
//   - building an object (grouping) with reduce
// =====================================================================================

const staff = [
  { id: 1, name: "Asha", dept: "IT", salary: 60000 },
  { id: 2, name: "Ravi", dept: "HR", salary: 45000 },
  { id: 3, name: "Meera", dept: "IT", salary: 75000 },
];

// ---- 1) The shape: reduce((accumulator, item) => newAccumulator, startValue) -------
// total starts at 0 (the second argument). For each item we return the new running total.
// Walk-through: 0 + 60000 = 60000, then + 45000 = 105000, then + 75000 = 180000
const totalSalary = staff.reduce((total, s) => total + s.salary, 0);
console.log(totalSalary); // 180000

// ---- 2) Average = total / count ------------------------------------------------------------
console.log(totalSalary / staff.length); // 60000

// ---- 3) Maximum: the accumulator can be an item, not just a number ---------------------
// Keep whichever of (best so far, current) has the higher salary. Start with the first item.
const top = staff.reduce((best, s) => (s.salary > best.salary ? s : best), staff[0]);
console.log(top.name); // Meera

// ---- 4) Group into an object: total salary per department --------------------------
// The accumulator is an object. For each employee we copy it (...acc) and set that department's total.
// [s.dept] is a computed key: its name comes from the value of s.dept. (acc[s.dept] || 0) means "or 0 if first time".
const byDept = staff.reduce((acc, s) => ({ ...acc, [s.dept]: (acc[s.dept] || 0) + s.salary }), {});
console.log(byDept); // { IT: 135000, HR: 45000 }

// ---- 5) Count per department (mutating the accumulator is fine: it is a private temporary) -------
const counts = staff.reduce((acc, s) => {
  acc[s.dept] = (acc[s.dept] || 0) + 1;
  return acc; // always return the accumulator
}, {});
console.log(counts); // { IT: 2, HR: 1 }
