// =====================================================================================
// STEP 01 - A web server with only Node (no Express)
// Run:  node steps/01-raw-http.js        then open http://localhost:5000/api/health
//
// WHAT YOU LEARN
//   - a server is a function that receives (req, res) for every request
//   - you must set the status, headers and body yourself
//   - routing by hand is tedious, which is exactly why Express exists (step 02)
//
// CONCEPT: HTTP is request -> response. The client (browser, Postman, curl) sends a request with a METHOD
// (GET, POST ...) and a URL. The server answers with a STATUS CODE, headers and a body.
// =====================================================================================
import http from "node:http"; // built-in HTTP module, no npm install needed

// http.createServer(handler)
//   USAGE: returns a server object. `handler` is called ONCE FOR EVERY incoming request with two objects:
//     req = the incoming request  (req.method, req.url, req.headers ...)
//     res = the outgoing response (you fill it in and finish it with res.end)
const server = http.createServer((req, res) => {
  // MANUAL ROUTING: we decide what to do by comparing the method and the URL ourselves.
  if (req.method === "GET" && req.url === "/api/health") {
    // res.writeHead(statusCode, headers): sets the status line and headers BEFORE the body.
    // "Content-Type: application/json" tells the client how to read the body.
    res.writeHead(200, { "Content-Type": "application/json" });

    // res.end(body): sends the body and FINISHES the response. If you forget it the client waits forever.
    // The body must be a string (or Buffer); JSON.stringify turns the object into JSON text.
    res.end(JSON.stringify({ status: "ok" }));
    return; // stop here so the 404 code below does not also run
  }

  // POST: the client sends a BODY. Node delivers it in small pieces ("chunks"), so we must collect them.
  //   req.on("data", fn)  fires for every chunk that arrives (req is an EventEmitter, see node-steps/05-events.js)
  //   req.on("end", fn)   fires once, when the whole body has arrived
  // Express does all of this for you with express.json() (step 03).
  if (req.method === "POST" && req.url === "/api/echo") {
    let body = ""; // text collected so far
    req.on("data", (chunk) => (body += chunk)); // chunk is a Buffer; += turns it into text and appends it
    req.on("end", () => {
      try {
        const data = JSON.parse(body); // text -> object; throws when the text is not valid JSON
        res.writeHead(201, { "Content-Type": "application/json" }); // 201 = Created
        res.end(JSON.stringify({ received: data }));
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" }); // 400 = Bad Request: the body was not JSON
        res.end(JSON.stringify({ message: "Body must be valid JSON" }));
      }
    });
    return; // the response is sent later, inside the "end" listener
  }

  // Any other method/URL combination: 404 Not Found.
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Not found" }));
});

// server.listen(port, callback): starts accepting connections on the port. The callback runs once when ready.
server.listen(5000, () => console.log("Raw Node server on http://localhost:5000"));

// TRY: add a second route /api/time that returns the current time. Notice how much code each route needs.
// STOP the server with Ctrl+C before starting the next step (they all use port 5000).
