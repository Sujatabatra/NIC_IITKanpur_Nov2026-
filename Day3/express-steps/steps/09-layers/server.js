// =====================================================================================
// STEP 09 - The layered structure (the shape of every real Express project)
// Run:  node steps/09-layers/server.js        Test with requests.http (same URLs as steps 05-08)
//
// WHAT YOU LEARN
//   server.js              starts listening (nothing else)
//   app.js                 creates the app and registers middleware + routers
//   routes/                URL + verb -> validation rules -> controller function
//   controllers/           read req, call the service, write res (HTTP only, no business logic)
//   services/              business rules and data access (NO req / res here). Day 4 replaces only this layer
//   middleware/            validate, errorHandler, timer
//   utils/                 ApiError, asyncHandler
// Every earlier step is in here, split into files. Compare 08-search-sort-paging.js with
// controllers/employee.controller.js + services/employee.service.js.
//
// CONCEPT: SEPARATION OF CONCERNS. Each file has ONE job, so a change in one place (for example switching
// from an array to MongoDB) does not ripple through the whole project.
// A request travels:  app.js -> routes -> (validation) -> controller -> service -> data, and the answer returns.
// =====================================================================================
import app from "./app.js"; // the configured Express app

// process.env.PORT is a string or undefined; `||` gives the default.
const PORT = process.env.PORT || 5000;

// app.listen(port, callback): open the port; the callback runs once when the server is ready.
app.listen(PORT, () => console.log(`Layered API on http://localhost:${PORT}/api/employees`));
