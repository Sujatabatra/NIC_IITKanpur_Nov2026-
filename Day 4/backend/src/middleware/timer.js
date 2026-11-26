// Custom middleware demo: proves execution order. Move it after the routes and it never runs.
export default (req, res, next) => {
  const start = Date.now(); // remember when the request arrived (ms)
  // log the start (skipped while running automated tests to keep output clean)
  if (process.env.NODE_ENV !== "test") console.log("-> before handler:", req.method, req.url);
  // "finish" fires when the response has been sent; then we can print the status and how long it took
  res.on("finish", () => {
    if (process.env.NODE_ENV !== "test") console.log("<- after response:", res.statusCode, `${Date.now() - start}ms`);
  });
  next(); // pass control to the next middleware; forgetting this would hang the request
};
