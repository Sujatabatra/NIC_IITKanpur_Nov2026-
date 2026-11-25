// =====================================================================================
// server.js - the ENTRY POINT of the API. This is the file `npm run dev` / `npm start` runs.
//
// Its only job is to start listening on a port. Everything else (middleware, routes) lives in
// src/app.js. Keeping "start the server" separate from "build the app" makes the app easy to test:
// a test can import app.js and call it without opening a real port.
// =====================================================================================

// IMPORT ORDER MATTERS. "dotenv/config" reads the .env file and copies each line into process.env.
// ES module imports are evaluated in the order written, so this must come BEFORE `import app`, because
// app.js and its middleware read process.env (for example CLIENT_URL) when they are loaded.
import "dotenv/config";
import app from "./src/app.js"; // the configured Express application (default export of app.js)

// process.env.PORT is a string from .env (or undefined); `||` gives the default 5000 when it is missing.
const PORT = process.env.PORT || 5000;

// app.listen(port, callback): opens the port and starts accepting requests.
// The callback runs once, when the server is ready. The template literal `${PORT}` inserts the value.
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
