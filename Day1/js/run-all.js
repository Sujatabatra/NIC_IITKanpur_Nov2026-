// run-all.js - runs every step script in order and prints a heading before each one.
// Usage: npm run all        (or: node run-all.js)
// This file is only a helper: the lessons are the numbered files (01-variables.js ... 15-...).

import { readdirSync } from "node:fs"; // read the names of the files in a folder
import { spawnSync } from "node:child_process"; // run another program and wait for it to finish
import { fileURLToPath } from "node:url";
import path from "node:path";

// In ES modules there is no __dirname, so we compute this folder from import.meta.url.
const dir = path.dirname(fileURLToPath(import.meta.url));

// Keep files named like "01-something.js" (two digits, a dash, anything, .js),
// skip the helper module that step 07 imports, and sort by name so the order is 01, 02, 03 ...
const files = readdirSync(dir)
  .filter((f) => /^\d\d-.*\.js$/.test(f) && f !== "07-modules-math.js")
  .sort();

for (const f of files) {
  console.log(`\n==================== ${f} ====================`);
  // process.execPath is the path of the running Node; run it with the step file as argument,
  // and show its output directly ("inherit").
  const r = spawnSync(process.execPath, [path.join(dir, f)], { stdio: "inherit" });
  if (r.status !== 0) console.log(`(exit code ${r.status})`);
}
