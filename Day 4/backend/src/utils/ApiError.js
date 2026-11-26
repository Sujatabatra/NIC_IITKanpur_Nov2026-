// An Error that also carries an HTTP status code, so code can `throw new ApiError(404, "Not found")`
// and the central error handler knows which status to send.
export default class ApiError extends Error {
  // statusCode: HTTP status (400, 401, 403, 404, 409 ...); message: text for the client; errors: optional per-field details.
  constructor(statusCode, message, errors) {
    super(message); // let the built-in Error store the message (and the stack trace)
    this.statusCode = statusCode; // keep the status for the error handler
    this.errors = errors; // keep the details (e.g. validation messages)
  }
}
