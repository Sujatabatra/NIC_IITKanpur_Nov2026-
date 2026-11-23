// =====================================================================================
// STEP 07 (part 2 of 2) - import and export (ES modules)
// Run:  node 07-modules.js        (package.json has "type": "module", which enables import/export)
//
// WHAT YOU LEARN
//   - importing a default export and named exports
//   - renaming an import, importing everything as a namespace
//   - why this is how React components and utility files are connected
// =====================================================================================

// ---- 1) Default import + named imports ----------------------------------------------------
// `multiply` has no braces because it is the default export (any name would work).
// `add` and `PI` are in braces because they are named exports (names must match exactly).
import multiply, { add, PI } from "./07-modules-math.js";

// ---- 2) Rename a named import with "as" -----------------------------------------------------
// Handy when two modules export the same name.
import { add as sum } from "./07-modules-math.js";

// ---- 3) Import everything as one object -------------------------------------------------
// `math` becomes an object with every named export, plus `default` for the default export.
import * as math from "./07-modules-math.js";

console.log(add(2, 3), multiply(2, 3), PI); // 5 6 3.14159
console.log(sum(10, 5)); // 15 (same function as add)
console.log(math.add(1, 1), math.PI, typeof math.default); // 2 3.14159 function

// NOTES
// - In Node, a relative import needs the file extension: "./07-modules-math.js".
// - In React/Vite you write the same thing for components: import Card from "./Card.jsx";
// - Without "type": "module" in package.json, Node would use the older require() style (CommonJS).
