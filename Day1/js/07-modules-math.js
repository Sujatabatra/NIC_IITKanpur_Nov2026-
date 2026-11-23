// =====================================================================================
// STEP 07 (part 1 of 2) - A module that exports things
// This file is imported by 07-modules.js. Read this file first, then open 07-modules.js.
//
// A "module" is just a file. Anything not exported stays private to the file.
// =====================================================================================

// ---- Named exports -------------------------------------------------------------------------
// A file can have many. The importer must use the exact name, inside { curly braces }.
export const add = (a, b) => a + b;
export const PI = 3.14159;

// ---- Default export ----------------------------------------------------------------------
// A file can have only ONE default export. The importer can give it any name and uses no braces.
// In React, each component file usually has one default export: the component itself.
export default function multiply(a, b) {
  return a * b;
}

// Not exported = private to this file
const secret = "not visible outside";
void secret; // (only here so the variable is "used")
