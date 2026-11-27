// app/not-found.js - NEW TOPIC (not in Day 2): the custom 404 page.
// Shown when a URL matches no route (try /nothing-here) or when code calls notFound() from "next/navigation".
import Link from "next/link";

export const metadata = { title: "Page not found" }; // becomes "Page not found | Employee Management"

export default function NotFound() {
  return (
    <div className="container">
      <div className="card">
        <h2>404 - page not found</h2>
        <p className="muted">The page you are looking for does not exist.</p>
        <Link className="btn" href="/dashboard">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
