// =====================================================================================
// STEP 04 - Files and paths: fs, path, os
// Run:  node 04-fs-path-os.js
//
// WHAT YOU LEARN
//   - build file paths with path.join (works on Windows and Linux)
//   - read and write files with fs/promises
//   - store data as JSON text with JSON.stringify / JSON.parse
//
// CONCEPT: a file holds TEXT or BYTES, never a JavaScript object. To save an object, convert it to JSON text
// (JSON.stringify). To use it again, convert the text back (JSON.parse).
// =====================================================================================
import fs from "node:fs/promises"; // every function here returns a promise, so we use await
import path from "node:path"; // helpers for building and reading file paths
import os from "node:os"; // information about the computer

// os.tmpdir() = the system's temporary folder (for example C:\Users\<you>\AppData\Local\Temp).
// path.join(a, b, ...) glues path pieces with the correct separator for the current system
// (\ on Windows, / on Linux), so never build paths by hand with "\\" or "/".
const dir = path.join(os.tmpdir(), "day3-demo"); // a temp folder, so we do not litter the project
const file = path.join(dir, "employees.json");

// fs.mkdir(folder, { recursive: true }): creates the folder AND any missing parent folders.
// With recursive: true it does NOT fail if the folder already exists.
await fs.mkdir(dir, { recursive: true });

const employees = [{ id: 1, name: "Asha" }, { id: 2, name: "Ravi" }];

// JSON.stringify(value, replacer, space): object -> text.
//   null = keep every field; 2 = indent with two spaces so the file is readable.
// fs.writeFile(path, text): creates the file or REPLACES its content.
await fs.writeFile(file, JSON.stringify(employees, null, 2)); // object -> text
console.log("written to", file);

// fs.readFile(path, "utf8"): returns the content as text ("utf8" is the text encoding; omit it and you get a Buffer).
const text = await fs.readFile(file, "utf8");
const loaded = JSON.parse(text); // JSON.parse: text -> object. It THROWS if the text is not valid JSON.
console.log("loaded", loaded.length, "employees");

// fs.appendFile(path, text): adds text to the END of a file (creating it if needed) without erasing anything.
// new Date().toISOString() gives the current time as text like 2026-11-25T10:15:00.000Z
await fs.appendFile(path.join(dir, "log.txt"), `run at ${new Date().toISOString()}\n`);

// fs.readdir(folder) returns an array with the names of the files inside the folder.
console.log("folder contains:", await fs.readdir(dir));

// path.extname("a/b.json") -> ".json"      path.basename("a/b.json") -> "b.json"
console.log("extension:", path.extname(file), "| file name:", path.basename(file));

// fs.rm(path, { recursive: true }) deletes a folder with everything inside it (cleanup so the demo can be re-run).
await fs.rm(dir, { recursive: true });
// `await` at the top level (outside any async function) works because this file is an ES module.
