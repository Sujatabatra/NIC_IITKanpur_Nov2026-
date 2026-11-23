// =====================================================================================
// STEP 15 - Putting it together: an in-memory "employee service"
// Run:  node 15-putting-it-together.js
//
// Uses everything from steps 01-14: const/let, arrow functions, template literals, destructuring,
// spread, rest, map/filter/find/reduce, promises and async/await.
// This is the same shape as the Express service you will write on Day 3.
// =====================================================================================

// ---- Data (our fake database) -------------------------------------------------------------
let employees = [
  { id: 1, name: "Asha", dept: "IT", salary: 60000 },
  { id: 2, name: "Ravi", dept: "HR", salary: 45000 },
  { id: 3, name: "Meera", dept: "IT", salary: 75000 },
];
let nextId = 4; // `let` because it changes every time we add someone

// A promise that finishes after `ms` milliseconds: pretends to be network / database delay.
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ---- The service: every method is async, like a real database call ---------------------
const api = {
  // list(): optional filters. `= {}` is a default so list() works with no argument.
  // Destructuring in the parameter gives dept and search (search defaults to "").
  async list({ dept, search = "" } = {}) {
    await delay(100);
    return employees
      .filter((e) => (dept ? e.dept === dept : true)) // keep all when no dept was given
      .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()));
  },

  // add(): destructure the new employee's fields and give it an id.
  async add({ name, dept, salary }) {
    await delay(100);
    const emp = { id: nextId++, name, dept, salary }; // nextId++ uses the value, then adds 1
    employees = [...employees, emp]; // immutable add: a NEW array
    return emp;
  },

  // update(): replace only the matching employee; merge the changes with spread.
  async update(id, changes) {
    await delay(100);
    if (!employees.find((e) => e.id === id)) throw new Error(`Employee ${id} not found`);
    employees = employees.map((e) => (e.id === id ? { ...e, ...changes } : e)); // immutable update
    return employees.find((e) => e.id === id);
  },

  // remove(): keep everyone except the given id.
  async remove(id) {
    await delay(100);
    employees = employees.filter((e) => e.id !== id); // immutable delete
  },
};

// A pure helper: total and per-department totals using reduce and destructuring.
const summary = (list) => {
  const total = list.reduce((sum, { salary }) => sum + salary, 0);
  const byDept = list.reduce((acc, { dept, salary }) => ({ ...acc, [dept]: (acc[dept] || 0) + salary }), {});
  return { count: list.length, total, byDept };
};

// ---- Using the service ----------------------------------------------------------------------
async function main() {
  console.log("All:", (await api.list()).map(({ name }) => name));

  const created = await api.add({ name: "Karan", dept: "IT", salary: 52000 });
  console.log(`Added ${created.name} with id ${created.id}`);

  await api.update(2, { salary: 48000 });
  await api.remove(1);

  console.log("IT only:", (await api.list({ dept: "IT" })).map((e) => e.name));
  console.log("Search 'me':", (await api.list({ search: "me" })).map((e) => e.name));
  console.log("Summary:", summary(await api.list()));

  // Errors thrown inside async functions are caught with try/catch.
  // `catch ({ message })` destructures the error object right in the catch clause.
  try {
    await api.update(99, { salary: 1 });
  } catch ({ message }) {
    console.error("Error handled:", message);
  }
}

main();
