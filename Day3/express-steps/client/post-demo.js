// =====================================================================================
// client/post-demo.js - a Node program that CALLS the API (instead of Postman or curl).
// Run (2 terminals):
//   terminal 1:  npm run step09            (or step06, step07, backend: any server with /api/employees)
//   terminal 2:  npm run client
//
// WHAT YOU LEARN
//   - fetch() sends an HTTP request from code (built into Node 18+, same as in the browser)
//   - a POST needs: method, a Content-Type header and a JSON STRING body
//   - response.status / response.ok / await response.json()
//   - how a valid POST (201), an invalid POST (400) and a duplicate POST (409) look from the client side
//
// NOTE: with step05 the invalid POST is accepted (no validation yet). With step06 and later it returns 400.
// =====================================================================================
const BASE = process.env.API_URL || "http://localhost:5000/api/employees";

// A small helper that sends a request and prints a one-line summary.
//   fetch(url, options) returns a promise for the Response (it resolves even for 400/404/500;
//   it rejects only when the network call itself fails, for example the server is not running).
async function call(label, method, url, body) {
  const response = await fetch(url, {
    method, // "GET", "POST", ...
    headers: { "Content-Type": "application/json" }, // tells the server the body is JSON, so express.json() parses it
    body: body ? JSON.stringify(body) : undefined, // the body must be TEXT: convert the object with JSON.stringify
  });
  // 204 has no body, so only read JSON when there is something to read.
  const data = response.status === 204 ? null : await response.json();
  console.log(`${label}\n  ${method} ${url}\n  -> ${response.status} (ok: ${response.ok})`);
  // The API adds a long `stack` field to errors in development; leave it out so the output stays readable.
  // `const { stack, ...rest } = data` copies every field except `stack` into `rest` (rest syntax).
  const { stack, ...rest } = data ?? {};
  console.log("  ", JSON.stringify(data ? rest : null));
  return data;
}

try {
  // A unique email each run, so the "duplicate" check below behaves the same way every time the script runs.
  const email = `client${Date.now()}@iitk.ac.in`;
  const valid = { name: "Client User", email, position: "Developer", department: "IT", salary: 50000 };

  await call("1) POST a valid employee (expect 201)", "POST", BASE, valid);
  await call("2) POST the SAME email again (expect 409 from step 07/09/backend)", "POST", BASE, valid);
  await call("3) POST invalid data (expect 400 from step 06 onwards)", "POST", BASE, { name: " ", email: "nope", salary: -5 });
  await call("4) GET the list to see the new employee", "GET", `${BASE}?limit=100`);
} catch (err) {
  // fetch rejects with "fetch failed" when nothing is listening on the port.
  console.error("Could not reach the API. Is a server running on port 5000?", err.cause?.code ?? err.message);
  process.exitCode = 1;
}
