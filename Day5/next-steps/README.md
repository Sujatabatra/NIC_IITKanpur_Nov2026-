# Day 2 - Next.js 15 App Router lessons (01 to 07)

```powershell
npm install
npm run dev        # http://localhost:3000, the home page lists the lessons
npm run build
```
Lessons are folders under `app/steps/`. Shared pieces: `app/layout.js` (root layout), `components/StepBanner.js` (lesson header),
`lib/employeesStore.js` (in-memory data for the API lessons), `app/api/steps/*` (route handlers).
Lesson 05 calls https://jsonplaceholder.typicode.com, so they need an internet connection.
Server `console.log` output appears in the terminal that runs `npm run dev`, not in the browser console.
Lesson table: see `../README.md`.
