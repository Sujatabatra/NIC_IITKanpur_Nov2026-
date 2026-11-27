// app/loading.js - NEW TOPIC (not in Day 2): the automatic loading screen.
//
// A file named loading.js is shown INSTANTLY while the page next to it (and everything below it) is
// still being prepared. Next.js wraps the page in React <Suspense> for us and uses this file as the fallback.
// You will see it flash when you open a route that does server work. Our pages fetch in the browser, so it
// is mostly visible on the first load; the step lessons (day5/steps/next-steps, lesson 01) make it obvious.
export default function Loading() {
  return <p className="container muted">Loading...</p>;
}
