// =====================================================================================
// config/swagger.js - a hand-written OpenAPI 3 description of the API.
// swagger-ui-express (see app.js) reads this object and draws the interactive page at /api-docs, where you can
// read each endpoint and press "Try it out". When you add or change an endpoint, update this file too,
// otherwise the documentation no longer matches the code.
// =====================================================================================
export const swaggerSpec = {
  openapi: "3.0.0", // version of the OpenAPI standard
  info: { title: "Employee API", version: "1.0.0", description: "MERN training API" }, // shown at the top of the page
  servers: [{ url: "http://localhost:5000/api" }], // base URL: the paths below are written without /api
  components: {
    // Reusable shapes. Endpoints point to them with $ref so they are written only once.
    schemas: {
      // Employee = what the API RETURNS (includes the generated id). "example" values fill the docs page.
      Employee: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Asha Verma" },
          email: { type: "string", example: "asha@iitk.ac.in" },
          position: { type: "string", example: "Developer" },
          department: { type: "string", example: "IT" },
          salary: { type: "number", example: 60000 },
        },
      },
      // EmployeeInput = what the API ACCEPTS in POST/PUT bodies (no id: the server creates it).
      EmployeeInput: {
        type: "object",
        required: ["name", "email", "position", "department", "salary"], // all fields are mandatory
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          position: { type: "string" },
          department: { type: "string" },
          salary: { type: "number" },
        },
      },
    },
  },
  // paths: one entry per URL, and under each URL one entry per HTTP method.
  paths: {
    "/employees": {
      get: {
        tags: ["Employees"], // groups endpoints in the UI
        summary: "List employees",
        // Query-string parameters (?search=...&page=2) for filtering, sorting and pagination
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "department", in: "query", schema: { type: "string" } },
          { name: "sort", in: "query", schema: { type: "string" }, description: "e.g. salary or -salary" },
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } },
        ],
        responses: { 200: { description: "OK" } },
      },
      post: {
        tags: ["Employees"],
        summary: "Create employee",
        // The JSON body must look like EmployeeInput (defined above, referenced with $ref)
        requestBody: { required: true, content: { "application/json": { schema: { $ref: "#/components/schemas/EmployeeInput" } } } },
        // Every status code this endpoint can return
        responses: { 201: { description: "Created" }, 400: { description: "Validation failed" }, 409: { description: "Duplicate email" } },
      },
    },
    "/employees/stats": {
      get: { tags: ["Employees"], summary: "Count and average salary per department", responses: { 200: { description: "OK" } } },
    },
    // {id} is a PATH parameter. It is declared once here and shared by get, put, patch and delete below.
    "/employees/{id}": {
      parameters: [{ name: "id", in: "path", required: true, schema: { type: "integer" } }],
      get: { tags: ["Employees"], summary: "Get one", responses: { 200: { description: "OK" }, 404: { description: "Not found" } } },
      put: {
        tags: ["Employees"],
        summary: "Replace",
        requestBody: { content: { "application/json": { schema: { $ref: "#/components/schemas/EmployeeInput" } } } },
        responses: { 200: { description: "OK" } },
      },
      patch: { tags: ["Employees"], summary: "Partial update", responses: { 200: { description: "OK" } } },
      delete: { tags: ["Employees"], summary: "Delete", responses: { 204: { description: "Deleted" } } },
    },
  },
};
