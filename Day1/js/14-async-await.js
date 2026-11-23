// =====================================================================================
// STEP 14 - async / await (promises that read like normal code)
// Run:  node 14-async-await.js
//
// WHAT YOU LEARN
//   - async functions and the await keyword
//   - try / catch / finally for errors
//   - sequential awaits vs running independent work in parallel
// =====================================================================================

// Same promise-returning function as step 13.
const fetchEmployee = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => (id <= 0 ? reject(new Error("Invalid id")) : resolve({ id, name: `Employee ${id}` })), 200);
  });

// "async" marks a function that may use await. An async function ALWAYS returns a promise.
// "await somePromise" pauses ONLY this function until the promise settles, then gives you the value.
// The rest of the program keeps running while it waits (see the last line of this file).
async function main() {
  try {
    // ---- 1) A simple await: reads top to bottom like synchronous code ----------------------
    const a = await fetchEmployee(1);
    console.log("first:", a);

    // ---- 2) Sequential: the second call needs the first result, so it must wait ----------
    const b = await fetchEmployee(a.id + 1);
    console.log("second:", b);

    // ---- 3) Parallel: independent calls should start together --------------------------
    // Awaiting them one by one would take 2 x 200ms; Promise.all takes about 200ms.
    const [c, d] = await Promise.all([fetchEmployee(3), fetchEmployee(4)]);
    console.log("parallel:", c.name, d.name);

    // ---- 4) A rejected promise throws at the await, so catch handles it -------------------
    await fetchEmployee(0);
    console.log("never printed");
  } catch (err) {
    console.error("caught:", err.message); // Invalid id
  } finally {
    console.log("done"); // always runs
  }
}

main();
console.log("main() has started; this line prints first");

// React preview (Day 2): const res = await fetch(url); const data = await res.json();
