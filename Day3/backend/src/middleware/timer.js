// =====================================================================================
// middleware/timer.js - a CUSTOM middleware that logs each request and how long it took.
// It demonstrates the (req, res, next) signature and why ORDER matters: move app.use(timer) below the routes
// and it never runs for requests that a route already answered.
// =====================================================================================
export default (req, res, next) => {
  const start = Date.now(); // Date.now() = milliseconds since 1970; remember when the request arrived
  if (process.env.NODE_ENV !== "test") console.log("-> before handler:", req.method, req.url);

  // res.on(eventName, listener): res is an EventEmitter (see node-steps/05-events.js).
  // "finish" is emitted after the response was fully sent, the right moment to log the final status and time.
  res.on("finish", () => {
    if (process.env.NODE_ENV !== "test") console.log("<- after response:", res.statusCode, `${Date.now() - start}ms`);
  });

  next(); // pass control to the next middleware/route. WITHOUT next() the request would hang forever.
};
