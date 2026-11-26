# Day 4 - Employee API with MongoDB, JWT cookie auth and roles

Built on the Day 3 API. Only the service layer changed for the existing endpoints; new: Mongoose models, auth
(bcrypt + JWT in an HttpOnly cookie), `protect` / `authorize` middleware, departments, a seed script and a stats endpoint
based on an aggregation pipeline. **The Day 5 frontend uses this backend.**

```powershell
npm install
copy .env.example .env      # then fill in MONGO_URI, JWT_SECRET, SEED_ADMIN_PASSWORD
npm run seed                # departments, admin user, 5 sample employees
npm run dev                 # http://localhost:5000
```

## Endpoints
| Method and URL | Access |
|---|---|
| `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout` | public |
| `GET /api/auth/me` | logged in |
| `GET /api/departments` | logged in |
| `POST /api/departments` | admin |
| `GET /api/employees` (`search`, `department`, `status`, `sort`, `page`, `limit`), `GET /api/employees/stats`, `GET /api/employees/:id` | logged in |
| `POST`, `PUT`, `PATCH`, `DELETE /api/employees...` | admin |
| `GET /api-docs` | Swagger UI |

Generate a JWT secret: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
Never commit `.env`. See `src/models/`, `src/middleware/auth.js`, `src/controllers/auth.controller.js`.
