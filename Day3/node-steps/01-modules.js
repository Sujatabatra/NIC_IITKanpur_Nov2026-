// =====================================================================================
// STEP 01 - Modules: ES Modules (import/export) and CommonJS (require)
// Run:  node 01-modules.js
//
// WHAT YOU LEARN
//   - "type": "module" in package.json makes every .js file an ES module
//   - named exports vs default export
//   - built-in modules are imported with the "node:" prefix
//   - how to load an old CommonJS file from an ES module
//
// CONCEPT: a MODULE is one file that exposes some values (export) and hides the rest. Other files
// pull in what they need (import). This lets a program be split into small, reusable files.
// =====================================================================================

// import X from "node:os"
//   USAGE: loads a BUILT-IN Node module. The "node:" prefix says "this ships with Node, it is not from npm".
//   `os` gives information about the computer (CPU count, memory, temp folder ...).
import os from "node:os";

// import { createRequire } from "node:module"
//   USAGE: braces mean a NAMED import (the exact exported name). createRequire builds a `require` function,
//   which an ES module does not have by itself.
import { createRequire } from "node:module";

// import square, { add } from "./lib/math.js"
//   USAGE: `square` (no braces) is the DEFAULT export, you may call it anything.
//          `{ add }` is a NAMED export, the name must match exactly.
//   RULE: a relative import in an ES module MUST include the file extension (.js).
import square, { add } from "./lib/math.js";
// import componentname from "absolute file name"
console.log(add(2, 3), square(4)); // prints: 5 16

// os.cpus() returns an array with one entry per CPU core, so .length is the number of cores.
console.log("CPU cores:", os.cpus().length);

// An ES module cannot use require() directly. Why do we need it? Some older libraries are CommonJS.
//   import.meta.url = the address of THIS file. createRequire(url) returns a require() that resolves
//   paths relative to this file.
const require = createRequire(import.meta.url);
const legacy = require("./lib/legacy.cjs"); // require() returns whatever the file put in module.exports
console.log(legacy.greet("Asha")); // calls the function from the CommonJS file

// import.meta.filename = full path of the current file. It replaces __filename, which exists only in CommonJS.
console.log("this file:", import.meta.filename);

// TRY: remove "type": "module" from package.json and run again. What error do you get?
//      (Node would treat this file as CommonJS, where `import` is not allowed.)
