# Day 5 - React front end (TRAINER deck)

The finished Employee Management System UI for the Day 4 backend, built with **React 19 + Vite + React Router 7 + axios**.
**Every line of code carries a comment**, so you can teach straight from the source. The matching learner version is
`../react-learner` (same files, key logic replaced by numbered `TODO`s).

> A few lines have no comment on purpose: a bare closing tag (`</div>`), `);` or `}` has nothing to explain.

## Run it
1. Start the backend first (`day4/backend`, port 5000). It must be seeded: `npm run seed`.
2. In this folder:
```powershell
npm install
copy .env.example .env
npm run dev
```
3. Open http://localhost:3000 and log in with the admin from the backend `.env` (`SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`).

Two things that bite people:
- **Use `localhost`, not `127.0.0.1`**, in the browser and in `.env`: the login cookie is shared between ports 3000 and 5000 only on the same host name.
- **The port is fixed to 3000** (`vite.config.js`, `strictPort`). The backend's CORS only allows `CLIENT_URL=http://localhost:3000`. If 3000 is busy Vite stops instead of moving to another port, which would silently break every request.

## Files and what each one teaches
| File | Concept to teach |
|---|---|
| `index.html`, `src/main.jsx` | Single page app: one HTML file, React mounts into `#root`; `StrictMode`; providers wrap the app |
| `src/App.jsx` | Route table, layout route without a path, URL parameter `:id`, catch-all `*`, `Navigate` redirect |
| `src/lib/api.js` | One axios instance, `.env` values in Vite (`VITE_` prefix), `withCredentials`, response **interceptor**, one predictable error shape |
| `src/context/AuthContext.jsx` | Context API, restoring a session on refresh (`/auth/me`), `useCallback`, derived value (`isAdmin`), custom hook `useAuth` |
| `src/hooks/useDebounce.js` | Custom hook, `useEffect` cleanup |
| `src/components/ProtectedRoute.jsx` | Guard with roles; **frontend guards are UX only, the backend enforces security** |
| `src/components/AppLayout.jsx`, `Navbar.jsx` | `<Outlet />`, conditional rendering with `&&` |
| `src/components/EmployeeForm.jsx` | Controlled inputs, one `handleChange` for many fields, one form reused by "new" and "edit" |
| `src/pages/Login.jsx`, `Register.jsx` | Form submit, loading flag, showing server validation errors |
| `src/pages/Dashboard.jsx` | Fetch on mount, loading / error / data states, `map` with `key` (uses the Day 4 aggregation endpoint) |
| `src/pages/EmployeeList.jsx` | The big one: search + filters + pagination, debounce, `AbortController`, "reload counter" trick |
| `src/pages/EmployeeDetail.jsx`, `EmployeeNew.jsx`, `EmployeeEdit.jsx` | `useParams`, POST / PUT / PATCH / DELETE, redirect after save, pre-filling a form |

## Suggested teaching order (about 3.5 hours)
1. **Setup and tour (15 min)**: run backend + front end, show the Network tab while logging in (cookie appears under Application > Cookies, marked HttpOnly).
2. **api.js + AuthContext (35 min)**: why one axios instance; why the interceptor exists; `login` -> cookie -> `/auth/me` on refresh.
3. **Routing + ProtectedRoute + Navbar (30 min)**: log out and open `/employees` to see the redirect; log in as a normal user and open `/employees/new` to see the 403 message.
4. **Dashboard (15 min)**: the first "fetch on mount" page; show loading/error/data.
5. **EmployeeForm + New + Edit (35 min)**: controlled inputs; why the edit page waits for data before rendering the form.
6. **EmployeeList (45 min)**: build it in layers: plain fetch -> filters -> debounce -> pagination -> delete/toggle.
7. **Wrap-up (15 min)**: full flow demo, then hand over `react-learner`.

## API contract this UI relies on (from `day4/backend`)
| Call | Used by | Notes |
|---|---|---|
| `POST /auth/login`, `/auth/register`, `/auth/logout`, `GET /auth/me` | AuthContext | reply `{ success, data: { id, name, email, role } }`; JWT is an HttpOnly cookie |
| `GET /employees?search&department&status&page&limit` | EmployeeList | reply `{ success, data: [...], meta: { total, page, limit, pages } }` |
| `GET /employees/stats` | Dashboard | `{ total, avgSalary, totalSalary, byDepartment }` |
| `GET /employees/:id`, `POST /employees`, `PUT` / `PATCH /employees/:id`, `DELETE /employees/:id` | detail / new / edit / list | writes are admin only; DELETE answers 204 |
| `GET /departments` | form + list filter | `{ success, data: [{ _id, name }] }` |
| any validation failure | all forms | `{ success: false, message, errors: [{ field, message }] }` |

## Good questions to ask the class
- Why is the token in an HttpOnly cookie and not in `localStorage`? (JavaScript, and therefore XSS, cannot read it.)
- What happens if we delete the `ProtectedRoute` check? (Pages still load, but every API call returns 401/403: the real protection is on the server.)
- Why does `EmployeeList` reset to page 1 when a filter changes?
- What bug does the `AbortController` cleanup prevent? (A slow old response overwriting a newer one.)
- Why `PATCH` for the status toggle but `PUT` for the edit form?

## Common problems
| Symptom | Cause / fix |
|---|---|
| Network error / CORS error in the console | Backend not running, or `CLIENT_URL` in `day4/backend/.env` is not `http://localhost:3000` |
| Login works but every page sends you back to login | You opened the app on `127.0.0.1` (cookie not shared) or `VITE_API_URL` uses `127.0.0.1` |
| `Port 3000 is already in use` | Stop the other process (e.g. the Next.js capstone in `day5/frontend`); this app must use 3000 |
| `undefined` in requests (`undefined/auth/me`) | Forgot `copy .env.example .env`, or restarted nothing after editing `.env` (restart `npm run dev`) |
| 403 on create / edit / delete | Logged in as a normal user; log in as the seeded admin |

## Relation to `day5/frontend`
`../frontend` is the Next.js 15 version of the same capstone (App Router, file-based routing). This folder is the plain
React (client-side) version. The ideas are identical; compare `ProtectedRoute` and `AuthContext` to see what Next.js changes.
