// =====================================================================================
// STEP 02 - The event loop: why Node never "waits"
// Run:  node 02-event-loop.js
//
// WHAT YOU LEARN
//   - Node runs your JavaScript on ONE thread
//   - slow work (timers, files, network) is handed off, and its callback runs later
//   - order: synchronous code -> nextTick -> promises (microtasks) -> timers / I/O
//
// CONCEPT: the CALL STACK holds the code running right now. When it is empty, the EVENT LOOP takes the next
// waiting callback from a queue and runs it. Different kinds of callbacks wait in different queues, and the
// queues have a fixed priority. That priority is what this file demonstrates.
// =====================================================================================
import fs from "node:fs"; // fs = file system module (callback style here)

console.log("1. sync start"); // synchronous code runs immediately, top to bottom

// setTimeout(callback, delayInMs)
//   USAGE: run `callback` after at least `delay` ms. Even with 0 the callback is queued for the TIMERS phase,
//   so it can never run before the current synchronous code has finished.
setTimeout(() => console.log("5. setTimeout 0 (timers phase)"), 0);

// setImmediate(callback)
//   USAGE: run `callback` in the CHECK phase, right after the I/O phase of the current loop turn.
setImmediate(() => console.log("6. setImmediate (check phase)"));

// fs.readFile(path, callback)
//   USAGE: asks the system to read a file and RETURNS AT ONCE. The callback runs later (I/O phase) when
//   the data is ready. import.meta.filename is the path of this very file, so the read always succeeds.
fs.readFile(import.meta.filename, () => console.log("7. file read callback (I/O)"));

// Promise.resolve().then(callback)
//   USAGE: Promise.resolve() makes a promise that is already fulfilled; .then(cb) queues cb as a MICROTASK.
//   Microtasks run as soon as the stack is empty, before the event loop moves to timers or I/O.
Promise.resolve().then(() => console.log("3. promise (microtask)"));

// process.nextTick(callback)
//   USAGE: queues cb in the nextTick queue, which has even higher priority than promise microtasks.
process.nextTick(() => console.log("2. nextTick (runs before promises)"));

console.log("4. sync end"); // still synchronous, so it prints before ALL callbacks above
// Predict the order BEFORE running. The relative order of 5, 6, 7 can vary slightly between runs.

// BLOCKING: a long synchronous loop freezes everything, including timers and (later) every web request,
// because the event loop cannot take the next callback until the stack is empty.
// Uncomment, run again, and notice the timer is late.
// setTimeout(() => console.log("timer fired (late!)"), 10);
// const end = Date.now() + 2000; // Date.now() = milliseconds since 1970
// while (Date.now() < end) {} // busy wait for 2 seconds: nothing else can run meanwhile
