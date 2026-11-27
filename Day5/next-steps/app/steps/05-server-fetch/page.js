// =====================================================================================
// STEP 05 - Fetching data in a Server Component
//
// URL:   /steps/05-server-fetch
//
// In the App Router a Server Component can be `async`: just `await fetch(...)` in the component body.
// No useEffect, no loading state variables, no client-side request waterfall:
//   - the data is fetched on the SERVER (close to your database, secrets stay private),
//   - the finished HTML is sent to the browser,
//   - the browser receives NO JavaScript for this component.
// Compare with the Day 2 hooks lesson 04 (client fetch with useEffect).
//
// `export const dynamic = "force-dynamic"` makes Next.js render the page on every request instead of
// once at build time, so you can see fresh data and a fresh timestamp each reload.
// =====================================================================================

import StepBanner from "@/components/StepBanner";

export const dynamic = "force-dynamic";

export default async function ServerFetchPage() {
  // This runs on the server. The request is NOT visible in the browser's Network tab.
  const res = await fetch("https://jsonplaceholder.typicode.com/users?_limit=5");
  if (!res.ok) throw new Error("Failed to load users"); // handled by the closest error.js (step 07)
  const users = await res.json();

  return (
    <>
      <StepBanner
        number={5}
        title="Fetching on the server"
        concept="An async Server Component can await fetch directly. The browser only receives the HTML."
        path="/steps/05-server-fetch"
        points={[
          "export default async function Page() { const data = await fetch(...) }",
          "No useEffect, no useState for loading",
          "Secrets and database access stay on the server",
          "Check View Page Source: the user names are already in the HTML",
        ]}
      />
      <div className="demo">
        <p>
          Fetched on the server at <b>{new Date().toLocaleTimeString()}</b>
        </p>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.name} - {u.email}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
