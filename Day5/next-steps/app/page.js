// app/page.js - the page for the URL "/" (the home page of the app).
//
// RULE OF THE APP ROUTER: a folder inside `app` is a URL segment, and a file named `page.js` inside it
// makes that URL public. app/page.js -> "/", app/steps/01-first-page/page.js -> "/steps/01-first-page".
//
// This page is the index of the lessons. Follow them in order: every step adds one Next.js concept.

import Link from "next/link";

const steps = [
  ["01-first-page", "First page", "page.js, file-system routing, Server Components"],
  ["02-link-navigation", "Link and navigation", "<Link> vs <a>, prefetching, usePathname for active links"],
  ["03-nested-routes", "Nested routes and layouts", "folders inside folders, nested layout.js that persists"],
  ["04-dynamic-routes", "Dynamic routes", "[id] folders, params, searchParams (?tab=...)"],
  ["05-server-fetch", "Fetching on the server", "async Server Components, fetch, no useEffect"],
  ["06-client-components", "Client Components", '"use client", hooks, passing server data as props'],
  ["07-route-handlers", "Route Handlers (API)", "app/api/.../route.js with GET, POST, PATCH, DELETE"],
];

export default function Home() {
  return (
    <>
      <h1>Day 2: Next.js step by step</h1>
      <p>Open each lesson in order. Read the comments in the matching files under app/steps.</p>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Lesson</th>
            <th>Concept</th>
          </tr>
        </thead>
        <tbody>
          {steps.map(([folder, title, concept], i) => (
            <tr key={folder}>
              <td>{i + 1}</td>
              <td>
                <Link href={`/steps/${folder}`}>{title}</Link>
              </td>
              <td>{concept}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
