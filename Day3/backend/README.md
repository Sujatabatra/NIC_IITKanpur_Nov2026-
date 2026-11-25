# Day 3 - Employee REST API (Express 5, in-memory data)

Layers: `routes -> controllers -> services`, plus middleware (validation, errors, timer), security basics
(helmet, CORS, rate limiting) and Swagger docs.

```powershell
npm install
copy .env.example .env
npm run dev          # http://localhost:5000
```

| URL | What |
|---|---|
| `GET /api/health` | health check |
| `GET /api/employees?search=&department=&sort=&page=&limit=` | list (filter, search, sort, paginate) |
| `GET /api/employees/stats` | count and average salary per department (lab) |
| `GET/PUT/PATCH/DELETE /api/employees/:id` | one employee |
| `POST /api/employees` | create |
| `http://localhost:5000/api-docs` | Swagger UI |

Test with Postman, or the REST Client file `api-tests/day3-employees.http` (in the `vscode` folder of the training kit).
On Day 4 only `src/services/employee.service.js` is replaced by a MongoDB version (see `../../day4/backend`).
