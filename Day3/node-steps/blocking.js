// =====================================================================================
// blocking.js - synchronous (blocking) versus asynchronous (non-blocking) file reads.
// Run:  npm run blocking      (or: node blocking.js)
//
// Expected order: "sync: ...ms", "after sync read", "after async read call", then "async read done".
//
// CONCEPT: a BLOCKING call (name ends in "Sync") stops the whole program until it finishes. In a web server
// that freezes EVERY request. A NON-BLOCKING call starts the work, returns at once, and runs a callback later.
// =====================================================================================
import { readFileSync, readFile } from "node:fs"; // two versions of the same function: Sync and callback

// BLOCKING: nothing else can run until the file has been read.
// console.time(label) starts a stopwatch; console.timeEnd(label) stops it and prints "label: 0.115ms".
console.time("sync");
readFileSync(import.meta.filename); // import.meta.filename = path of this file
console.timeEnd("sync");
console.log("after sync read"); // only reached after the read finished

// NON-BLOCKING: readFile(path, callback) returns immediately; the callback runs when the data is ready.
readFile(import.meta.filename, () => console.log("async read done"));
console.log("after async read call"); // prints BEFORE "async read done": the program did not wait
