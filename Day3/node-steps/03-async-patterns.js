// =====================================================================================
// STEP 03 - Callbacks -> Promises -> async/await
// Run:  node 03-async-patterns.js
//
// WHAT YOU LEARN
//   - the same job written three ways
//   - error handling with try/catch
//   - running independent jobs in parallel with Promise.all
//
// CONCEPT: an ASYNCHRONOUS function starts work and returns BEFORE the work is finished. JavaScript gives
// three ways to receive the result later: a callback, a promise, or async/await (a nicer way to use promises).
// =====================================================================================

// Two versions of readFile exist: one that takes a callback ("node:fs") and one that returns a promise
// ("node:fs/promises"). `as readFilePromise` renames the import to avoid a name clash.
import { readFile } from "node:fs";
import { readFile as readFilePromise } from "node:fs/promises";

// 1) CALLBACK style
//   USAGE: readFile(path, encoding, callback). "utf8" makes the result TEXT (without it you get raw bytes).
//   Node always calls the callback as (error, data). If error is set, something failed and data is empty.
//   Nesting several of these inside each other becomes "callback hell".
readFile(import.meta.filename, "utf8", (err, text) => {
  if (err) return console.error("callback error", err.message); // handle the error first, then stop
  console.log("1. callback read", text.length, "characters");
});

// 2) PROMISE style
//   A PROMISE is an object for a result that is not ready yet. States: pending -> fulfilled (has a value)
//   or rejected (has an error).
//   .then(fn) runs fn with the value when fulfilled; .catch(fn) runs fn when rejected.
readFilePromise(import.meta.filename, "utf8")
  .then((text) => console.log("2. promise read", text.length, "characters"))
  .catch((err) => console.error(err.message));

// 3) async/await style: reads like normal top-to-bottom code. This is what we use from now on.
//   `new Promise((resolve) => ...)` builds your own promise. Calling resolve() marks it fulfilled.
//   setTimeout(resolve, ms) means "call resolve after ms milliseconds", so wait(300) is a promise that
//   becomes fulfilled after 300 ms.
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

//   `async` before a function lets you use `await` inside it, and makes it return a promise.
//   `await somePromise` pauses ONLY this function until the promise settles; the rest of the program keeps running.
async function main() {
  try {
    const text = await readFilePromise(import.meta.filename, "utf8"); // value, not a promise
    console.log("3. await read", text.length, "characters");

    // Sequential: the second wait starts only after the first has ended, about 600 ms in total.
    //   console.time(label) / console.timeEnd(label) measure and print the elapsed time.
    console.time("sequential");
    await wait(300);
    await wait(300);
    console.timeEnd("sequential");

    // Parallel: Promise.all([...]) takes an array of promises, starts them together and itself becomes
    // fulfilled when ALL are done. Total time is the slowest job, about 300 ms. Use it for independent jobs.
    console.time("parallel");
    await Promise.all([wait(300), wait(300)]);
    console.timeEnd("parallel");

    // Reading a file that does not exist makes the promise REJECT. await then throws, so control jumps to catch.
    await readFilePromise("does-not-exist.txt");
  } catch (err) {
    console.log("caught:", err.code); // ENOENT = "error, no such entry" (file or folder not found)
  }
}
main(); // calling an async function returns a promise; here we do not need to wait for it
