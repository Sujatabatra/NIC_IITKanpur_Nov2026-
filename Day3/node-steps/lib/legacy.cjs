// lib/legacy.cjs - a CommonJS module (the older Node style).
// The .cjs extension tells Node to treat this file as CommonJS even though package.json says "type": "module".

// module.exports is the single object that require("./lib/legacy.cjs") hands back to the caller.
// Here it is an object with one function, greet.
// `${name}` inside backticks is a template literal: the variable is inserted into the text.
module.exports = { greet: (name) => `Hello ${name} (from CommonJS)` };
