// =====================================================================================
// middleware.js (project root, next to `app`) - code that runs BEFORE a page is rendered.
//
// NEW TOPIC (not in Day 2): Middleware runs on the server for every request that matches `config.matcher`.
// It can redirect, rewrite, or add headers before React renders anything.
//
// What we use it for: a FAST first gate. If a visitor has no login cookie, send them to /login right
// away instead of loading a page that would only flash "Checking session..." and then redirect.
//
// IMPORTANT - this is NOT real security:
//   * we only check that a cookie called "token" EXISTS; middleware does not verify the JWT signature
//     (the secret lives on the backend), so a fake cookie would pass this gate,
//   * the backend still answers 401 / 403 to every API call without a valid token.
//   Think of middleware (and ProtectedRoute) as user experience, and the API as the real lock.
//
// Why does it see the cookie set by port 5000?  Browsers scope cookies by HOST, not by port. A cookie for
// "localhost" is sent to localhost:3000 and localhost:5000 alike. (This is also why you must use
// "localhost" everywhere and not 127.0.0.1 for half of the URLs.)
// =====================================================================================
import { NextResponse } from "next/server";

export function middleware(request) {
  const hasToken = request.cookies.has("token"); // is there a login cookie?
  const { pathname } = request.nextUrl; // the requested path, e.g. "/employees"
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Not logged in and trying to open a private page -> login.
  if (!hasToken && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  // We deliberately do NOT redirect "has cookie + on /login" to the dashboard here: an EXPIRED cookie
  // still exists, so ProtectedRoute would send the user to /login, middleware would send them back to
  // /dashboard, and the browser would loop forever. The login page itself redirects real sessions (client side).
  return NextResponse.next(); // everything is fine: continue to the page
}

// Only run for real pages. Skip Next.js internals, images and files with an extension (favicon.ico, .svg ...).
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
