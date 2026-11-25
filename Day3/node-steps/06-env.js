// =====================================================================================
// STEP 06 - Environment variables and dotenv
// Run:  copy .env.example .env     (PowerShell)
//       node 06-env.js
//
// WHAT YOU LEARN
//   - configuration (ports, secrets) lives OUTSIDE the code, in environment variables
//   - process.env always holds strings
//   - never commit the real .env file
//
// CONCEPT: an ENVIRONMENT VARIABLE is a named value that the operating system gives to a program. Settings
// that differ per computer (port, database address, secret keys) are read from there instead of being typed
// in the code. During development they are kept in a .env file, one NAME=value per line.
// =====================================================================================

// dotenv reads the .env file in the current folder and copies each line into process.env.
// This import has a side effect and exports nothing, and it must run BEFORE you read any variable.
// A variable that is already set in the real environment is NOT overwritten by the .env file.
import "dotenv/config";

// process.env is an object holding every environment variable. A missing one is `undefined`.
console.log("APP_NAME:", process.env.APP_NAME);

// Environment values are ALWAYS strings, even when they look like numbers.
//   Number("5000") -> 5000.   Number(undefined) -> NaN, which is falsy, so `|| 3000` supplies the default.
const port = Number(process.env.PORT) || 3000; // string -> number, with a default
console.log("PORT:", port, typeof port); // typeof port prints "number", proving the conversion worked

// `??` (nullish coalescing): use the right side only when the left is undefined or null.
console.log("NODE_ENV:", process.env.NODE_ENV ?? "(not set)");

// process.argv is an array: [path to node, path to this script, ...your own arguments].
// slice(2) drops the first two, leaving only what you typed after the file name.
console.log("command line args:", process.argv.slice(2)); // try: node 06-env.js hello 42

// TRY (PowerShell): $env:PORT=1234; node 06-env.js   (a real environment variable beats the .env file)
