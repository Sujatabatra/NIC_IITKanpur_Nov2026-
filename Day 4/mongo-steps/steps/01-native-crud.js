// =====================================================================================
// STEP 01 - MongoDB itself: documents and CRUD (no schema, no Mongoose models yet)
// Run:  node steps/01-native-crud.js      (MongoDB must be running, see README)
//
// WHAT YOU LEARN
//   - a database holds COLLECTIONS, a collection holds DOCUMENTS (JSON-like objects)
//   - every document gets a unique _id (an ObjectId) automatically
//   - the same insert / find / update / delete you would type in mongosh or Compass
//
// Mongoose sits on top of the official driver. `mongoose.connection.db` gives the raw driver,
// so each line below has a one-to-one mongosh equivalent (shown in the comments).
// =====================================================================================

// Import mongoose so we can reach the raw driver through mongoose.connection.db.
import mongoose from "mongoose";
// Import our two helpers from lib/db.js: connect() opens the connection, disconnect() closes it.
import { connect, disconnect } from "../lib/db.js";

// Top-level await (allowed in ES modules): wait until we are connected before doing anything else.
await connect();
// Get a handle to the collection named "scratch". MongoDB creates it lazily, on the first insert.
const scratch = mongoose.connection.db.collection("scratch");
// Delete ALL documents ({} = match everything) so re-running the script starts from an empty collection.
await scratch.deleteMany({});

// CREATE      mongosh: db.scratch.insertMany([...])
// insertMany stores several documents in one call. MongoDB adds an _id to each.
await scratch.insertMany([
  { name: "Asha", department: "IT", salary: 60000 },
  { name: "Ravi", department: "HR", salary: 45000 },
  { name: "Meera", department: "IT", salary: 85000 },
  { name: "Karan", department: "Finance", salary: 52000 },
]);

// READ with a filter     mongosh: db.scratch.find({ department: "IT" })
// find() returns a cursor (a lazy stream of results); .toArray() pulls them all into a normal array.
console.log("IT staff:", await scratch.find({ department: "IT" }).toArray());

// Query operators start with $. $gte = greater than or equal. The 2nd argument is a PROJECTION
// (which fields to return): 1 = include, 0 = exclude. Here: only `name`, and hide the _id.
console.log("salary >= 50000:", await scratch.find({ salary: { $gte: 50000 } }, { projection: { name: 1, _id: 0 } }).toArray());

// sort / skip / limit = pagination.  -1 = descending.  Page 2 with 2 per page = skip 2, limit 2.
// sort({ salary: -1 }) = highest salary first; skip(2) = ignore the first 2; limit(2) = return at most 2.
console.log("page 2:", await scratch.find().sort({ salary: -1 }).skip(2).limit(2).toArray());

// UPDATE: $set replaces a field, $inc adds to a number.
// updateOne changes the FIRST document that matches { name: "Asha" }: salary becomes 70000.
await scratch.updateOne({ name: "Asha" }, { $set: { salary: 70000 } });
// updateMany changes EVERY match: add 1000 to the salary of all IT staff.
await scratch.updateMany({ department: "IT" }, { $inc: { salary: 1000 } });
// Read the IT staff again; .project() is the cursor form of the projection (keep only name and salary).
console.log("after update:", await scratch.find({ department: "IT" }).project({ name: 1, salary: 1, _id: 0 }).toArray());

// DELETE
// deleteOne removes the first match and returns a result object that includes deletedCount.
const res = await scratch.deleteOne({ name: "Ravi" });
// 1 if a document was deleted, 0 if nothing matched.
console.log("deleted:", res.deletedCount);

// countDocuments() with no filter counts every document left in the collection.
console.log("count left:", await scratch.countDocuments());
// Close the connection so the script can exit.
await disconnect();

// TRY IT: IT staff above 65000, sorted by name.   (filter: { department: "IT", salary: { $gt: 65000 } })
// TRY IT: open Compass, connect, and look at mern_steps > scratch.
