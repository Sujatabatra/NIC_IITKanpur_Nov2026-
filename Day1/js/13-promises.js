// =====================================================================================
// STEP 13 - Promises
// Run:  node 13-promises.js
//
// WHAT YOU LEARN
//   - a promise is "a value that will exist later"
//   - states: pending -> fulfilled (resolve) or rejected (reject)
//   - then / catch / finally
//   - chaining instead of nesting, and running promises in parallel with Promise.all
// =====================================================================================

// ---- 1) Creating a promise ----------------------------------------------------------------------
// new Promise(executor): the executor receives two functions.
//   resolve(value) -> success, the promise is fulfilled with that value
//   reject(error)  -> failure, the promise is rejected with that error
const fetchEmployee = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) reject(new Error("Invalid id"));
      else resolve({ id, name: `Employee ${id}` });
    }, 200);
  });

// ---- 2) Consuming a promise ---------------------------------------------------------------------
// .then(fn)    runs when it succeeds
// .catch(fn)   runs when it fails (or when anything earlier in the chain throws)
// .finally(fn) runs either way (good for hiding a loading spinner)
fetchEmployee(1)
  .then((emp) => console.log("then:", emp))
  .catch((err) => console.error("catch:", err.message))
  .finally(() => console.log("finally: runs either way"));

fetchEmployee(0)
  .then((emp) => console.log("not reached", emp)) // skipped because the promise was rejected
  .catch((err) => console.error("catch:", err.message)); // handles the rejection

// ---- 3) Chaining: no more nesting ----------------------------------------------------------
// Each .then returns a NEW promise, so the next .then waits for it. Compare with step 12!
fetchEmployee(1)
  .then((a) => fetchEmployee(a.id + 1))
  .then((b) => fetchEmployee(b.id + 1))
  .then((c) => console.log("chained:", c));

// ---- 4) Parallel: start all, wait for all -----------------------------------------------------
// Promise.all takes an array of promises and gives back an array of results (in the same order).
// If ANY promise rejects, Promise.all rejects.
Promise.all([fetchEmployee(1), fetchEmployee(2), fetchEmployee(3)]).then((all) =>
  console.log("Promise.all:", all.map((e) => e.name))
);

// Synchronous code always finishes first; promise callbacks run afterwards.
console.log("sync code finishes first");
