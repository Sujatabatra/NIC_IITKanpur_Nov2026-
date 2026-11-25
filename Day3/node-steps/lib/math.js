// lib/math.js - an ES module. Other files load it with `import` (see ../01-modules.js).
// Anything NOT exported stays private to this file.

// NAMED export: importers write  import { add } from "./lib/math.js"  and must use this exact name.
// `(a, b) => a + b` is an arrow function: it takes two inputs and returns their sum.
export const add = (a, b) => a + b;

// DEFAULT export: at most ONE per file. Importers write  import anyName from "./lib/math.js".
export default function square(n) {
  return n * n; // multiply the number by itself
}
