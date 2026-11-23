// =====================================================================================
// STEP 04 - Object destructuring
// Run:  node 04-object-destructuring.js
//
// WHAT YOU LEARN
//   - pulling several properties out of an object in one line
//   - renaming, default values and nested destructuring
//   - destructuring in function parameters (exactly how React components receive props)
// =====================================================================================

const employee = {
  id: 1,
  name: "Asha",
  dept: "IT",
  address: { city: "Kanpur", pin: "208016" },
};

// ---- 1) Without destructuring: one line per property ---------------------------------
const n1 = employee.name;
const d1 = employee.dept;

// ---- 2) With destructuring: the variable names must match the property names -------
// Read it as "take name and dept out of employee".
const { name, dept } = employee;
console.log(n1, d1, name, dept); // Asha IT Asha IT

// ---- 3) Renaming while destructuring -------------------------------------------------
// "name: employeeName" means: take the property `name` and call the variable `employeeName`.
// Useful when a variable called `name` already exists.
const { name: employeeName } = employee;
console.log(employeeName); // Asha

// ---- 4) Default value ------------------------------------------------------------------
// employee has no salary property, so the default 0 is used.
const { salary = 0 } = employee;
console.log(salary); // 0

// ---- 5) Nested objects -------------------------------------------------------------------
// Go into address and pull out city. (Note: `address` itself is NOT created as a variable here.)
const {
  address: { city },
} = employee;
console.log(city); // Kanpur

const {address}=employee;
console.log(address)

// ---- 6) In function parameters --------------------------------------------------------
// The function receives one object, and we immediately unpack the two fields we need.
const describe = ({ name, dept }) => `${name} (${dept})`;
console.log(describe(employee)); // Asha (IT)

// React preview: function Card({ title, children }) { ... }
// React passes ONE object (called props); destructuring pulls out the props you want.
