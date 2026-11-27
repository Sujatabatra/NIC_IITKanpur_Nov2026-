# Day 5 - Employee Management System: Next.js frontend

Next.js 15 (App Router) + React 19 + axios. Talks to the Day 4 backend (`../../day4/backend`, port 5000).
HttpOnly JWT cookie auth, route guards, role-based UI, dashboard, employee list with search / filters / pagination,
create, edit and details pages. **Every file has explanatory comments**; read `../MANUAL.md` for the React walkthrough.

```powershell
# 1) backend (in codebase\day4\backend): npm install, copy .env.example .env, fill it in, npm run seed, npm run dev
# 2) frontend
npm install
copy .env.local.example .env.local
npm run dev          # http://localhost:3000
```
Log in with the admin from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` in the backend `.env`. Register a new account to see the read-only `user` role.
Use `localhost` (not `127.0.0.1`) so the cookie and the CORS allow-list match.

## CORS: two ways to connect (set in `.env.local`, restart after changing)
| Mode | `.env.local` | Needs backend CORS? |
|---|---|---|
| A direct (default) | `NEXT_PUBLIC_API_URL=http://localhost:5000/api` | yes: `CLIENT_URL` in `day4/backend/.env` must contain this origin |
| B proxy | `NEXT_PUBLIC_API_URL=/api` and `BACKEND_URL=http://localhost:5000` | no: `rewrites()` in `next.config.mjs` forwards `/api/*` |

## Files
| Area | Files |
|---|---|
| API client (axios, `withCredentials`, CORS modes) | `lib/api.js`, `next.config.mjs` |
| Auth state and session restore (Context) | `context/AuthContext.js` |
| Guards: instant cookie check, then session + role check | `middleware.js`, `components/ProtectedRoute.js` |
| Layouts and route groups | `app/layout.js`, `app/(app)/layout.js`, `app/(auth)/...` |
| Public pages | `app/(auth)/login`, `app/(auth)/register` |
| Protected pages | `app/(app)/dashboard`, `app/(app)/employees/...` |
| Shared form and hook | `components/EmployeeForm.js`, `hooks/useDebounce.js` |
| Loading, error and 404 screens | `app/loading.js`, `app/error.js`, `app/not-found.js` |

## Notes
- `npm run build` and `npx eslint` pass.
- `middleware.js` only checks that a `token` cookie exists; the backend is the real authority.
- Do not run this at the same time as `react-trainer`, `react-learner` or `steps/next-steps` (all use port 3000).
