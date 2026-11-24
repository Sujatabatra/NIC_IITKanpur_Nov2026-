# Day 1 - React steps (Vite)

One lesson per file in `src/steps/` (`01-jsx-basics.jsx` ... `22-complete-employee-app.jsx`).
`src/App.jsx` loads them in name order and shows, for each: what is new, the live demo, things to try and the source.

```powershell
npm install
npm run dev        # http://localhost:5173
npm run build
```

To add a step, create `src/steps/23-your-topic.jsx` that exports a default component and a `meta` object
(`title`, `concept`, `newInThisStep: []`, `tryThis: []`); it appears in the menu automatically.
