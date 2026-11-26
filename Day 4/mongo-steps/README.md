# Day 4 - MongoDB, Mongoose and Authentication, step by step

Eleven small scripts. Run them in order; each adds exactly one idea to the previous one.
Each file starts with **WHAT YOU LEARN** and ends with **TRY IT**, and every statement has a comment.

## Setup (once)
```powershell
cd D:\Mern_IITK\codebase\day4\steps\mongo-steps
npm install
```
That is all. **There is no `.env` file in this project.** Every setting is written in plain sight in
[`lib/config.js`](lib/config.js): the connection string (`MONGO_URI`), the port, the JWT secret and the seed admin.
Open it and read it. To use MongoDB Atlas instead of a local MongoDB, replace the `MONGO_URI` line (an Atlas example is in the file).

> Training only. In a real project these values are secrets and live in a `.env` file that is never committed.
> The finished project `../../backend` does it the real way.

All steps use the database **mern_steps**, so they never touch the finished backend's data (`mern_training`).
MongoDB must be running first (`Get-Service MongoDB`, or Atlas).

## Data is kept
Steps do **not** delete their data when they finish, so you can open MongoDB Compass (`mongodb://127.0.0.1:27017`) and look at
database `mern_steps` after each step. A step only empties **its own collections at the start**, so you can re-run it without
duplicate errors. To wipe everything: in Compass hover `mern_steps` and click the trash icon.

## The steps
| # | Command | Idea | Collections it leaves in Compass |
|---|---|---|---|
| 01 | `npm run step01` | Documents, insert / find / update / delete, `$set`, `$inc`, sort / skip / limit | `scratch` |
| 02 | `npm run step02` | `mongoose.connect`, the URI, fail fast | none (connection only) |
| 03 | `npm run step03` | Schema, Model, validation, `unique` index, timestamps | `step3employees` |
| 04 | `npm run step04` | CRUD with Mongoose, search, pagination, `runValidators` | `step4people` |
| 05 | `npm run step05` | References and `populate()` (`lib/models.js` starts here) | `departments`, `employees` |
| 06 | `npm run step06` | Aggregation: `$group`, `$lookup`, `$unwind`, `$project` | `departments`, `employees` |
| 07 | `npm run step07` | Express API on MongoDB, error handler (400 / 404 / 409) | `departments`, `employees` |
| 08 | `npm run step08` | bcrypt: hash, salt, cost, compare | none (no database) |
| 09 | `npm run step09` | JWT: sign, verify, expire, tamper | none (no database) |
| 10 | `npm run step10` | register / login / logout / me, HttpOnly cookie, `protect`, `authorize("admin")` | `users` |
| 11 | `npm run step11` | Idempotent seed: departments, admin, employees | `departments`, `users`, `employees` |

Steps 05, 06, 07 and 11 share the `employees` and `departments` collections. Steps 05 and 06 empty them at the start. Step 11 never
deletes: it adds the admin and the departments if missing, and inserts the 5 sample employees **only if `employees` is empty**
(so after step 06 it keeps step 06's employees). For a clean seed, delete the `mern_steps` database in Compass first, then run step 11. Steps 07 and 10 are servers on port 5000: stop one (`Ctrl+C`) before starting the other. Use
`requests.http` (REST Client extension) to call them.

Suggested order for 10: `npm run step11` (creates the admin) -> `npm run step10` -> follow the TRY IT list at the bottom of the file.
Admin login for the tests: `admin@example.com` / `Admin@12345` (from `lib/config.js`).

## Where this ends up
`../../backend` is the finished Day 4 project: the same ideas split into `models/`, `services/`, `controllers/`,
`routes/`, `middleware/`, plus validation, rate limiting and Swagger. After step 11, open its `src/` folder and match
each file to the step where you first wrote that code:

| Finished backend file | Built in step |
|---|---|
| `config/db.js`, `server.js` | 02 |
| `models/Employee.js`, `Department.js` | 03, 05 |
| `services/employee.service.js` (`list`, `stats`) | 04, 06 |
| `middleware/errorHandler.js` | 07 |
| `models/User.js` (hash, `matchPassword`) | 08 |
| `utils/token.js` | 09 |
| `middleware/auth.js`, `controllers/auth.controller.js` | 10 |
| `seed.js` | 11 |
