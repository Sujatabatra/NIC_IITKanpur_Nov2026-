// Swagger/OpenAPI: a JSON description of the API that swagger-ui-express turns into the interactive page at /api-docs.
// Nothing here runs the API; it only documents it.

// Reusable request-body description for endpoints that take an employee (refers to the EmployeeInput schema below).
const employeeBody = {
  required: true, // a body must be sent
  content: { "application/json": { schema: { $ref: "#/components/schemas/EmployeeInput" } } }, // $ref = "use that definition"
};
// Marks an endpoint as needing the login cookie (defined in securitySchemes below).
const secured = [{ cookieAuth: [] }];

export const swaggerSpec = {
  openapi: "3.0.0", // version of the OpenAPI standard
  info: { title: "Employee API", version: "2.0.0", description: "MERN training API (MongoDB, JWT cookie auth)" }, // page header
  servers: [{ url: "http://localhost:5000/api" }], // base URL used by "Try it out"
  components: {
    // How authentication works: an API key that lives in a cookie named "token".
    securitySchemes: { cookieAuth: { type: "apiKey", in: "cookie", name: "token" } },
    schemas: {
      // Shape of the JSON needed to create an employee.
      EmployeeInput: {
        type: "object",
        required: ["name", "email", "position", "department", "salary"], // mandatory fields
        properties: {
          name: { type: "string", example: "Asha Verma" },
          email: { type: "string", example: "asha@iitk.ac.in" },
          position: { type: "string", example: "Developer" },
          department: { type: "string", description: "Department ObjectId" },
          salary: { type: "number", example: 60000 },
          status: { type: "string", enum: ["active", "inactive"] },
        },
      },
      // Shape of the JSON needed to log in.
      Credentials: {
        type: "object",
        required: ["email", "password"],
        properties: { email: { type: "string" }, password: { type: "string" } },
      },
    },
  },
  // One entry per URL; inside it one entry per HTTP verb. `tags` groups endpoints in the UI,
  // `responses` lists the status codes the endpoint can return.
  paths: {
    // POST /auth/register
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register (role is always user)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              // inline schema: name, email and a password of at least 8 characters
              schema: { type: "object", required: ["name", "email", "password"], properties: { name: { type: "string" }, email: { type: "string" }, password: { type: "string", minLength: 8 } } },
            },
          },
        },
        responses: { 201: { description: "Created, cookie set" }, 400: { description: "Validation failed" }, 409: { description: "Email registered" } },
      },
    },
    // POST /auth/login
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login (sets the HttpOnly token cookie)",
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/Credentials" } } } },
        responses: { 200: { description: "OK" }, 401: { description: "Invalid email or password" } },
      },
    },
    // POST /auth/logout and GET /auth/me (security: secured -> needs the cookie)
    "/auth/logout": { post: { tags: ["Auth"], summary: "Logout (clears the cookie)", responses: { 200: { description: "OK" } } } },
    "/auth/me": { get: { tags: ["Auth"], summary: "Current user", security: secured, responses: { 200: { description: "OK" }, 401: { description: "Not authenticated" } } } },
    // GET and POST /departments
    "/departments": {
      get: { tags: ["Departments"], summary: "List departments", security: secured, responses: { 200: { description: "OK" } } },
      post: { tags: ["Departments"], summary: "Create department (admin)", security: secured, responses: { 201: { description: "Created" }, 403: { description: "Forbidden" } } },
    },
    // GET (list) and POST (create) on /employees
    "/employees": {
      get: {
        tags: ["Employees"],
        summary: "List employees",
        security: secured,
        // the query-string options that appear as input boxes in the UI
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "department", in: "query", schema: { type: "string" } },
          { name: "status", in: "query", schema: { type: "string", enum: ["active", "inactive"] } },
          { name: "sort", in: "query", schema: { type: "string" }, description: "name, salary, createdAt (prefix - for descending)" },
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: { 200: { description: "OK" }, 401: { description: "Not authenticated" } },
      },
      post: { tags: ["Employees"], summary: "Create employee (admin)", security: secured, requestBody: employeeBody, responses: { 201: { description: "Created" }, 403: { description: "Forbidden" }, 409: { description: "Duplicate email" } } },
    },
    // GET /employees/stats
    "/employees/stats": { get: { tags: ["Employees"], summary: "Totals and per-department stats", security: secured, responses: { 200: { description: "OK" } } } },
    // /employees/{id}: the {id} placeholder is a path parameter shared by all verbs below
    "/employees/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }],
      get: { tags: ["Employees"], summary: "Get one", security: secured, responses: { 200: { description: "OK" }, 404: { description: "Not found" } } },
      put: { tags: ["Employees"], summary: "Replace (admin)", security: secured, requestBody: employeeBody, responses: { 200: { description: "OK" } } },
      patch: { tags: ["Employees"], summary: "Partial update (admin)", security: secured, responses: { 200: { description: "OK" } } },
      delete: { tags: ["Employees"], summary: "Delete (admin)", security: secured, responses: { 204: { description: "Deleted" } } },
    },
  },
};
