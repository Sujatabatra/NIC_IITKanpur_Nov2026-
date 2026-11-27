// app/(app)/layout.js - the layout for every PRIVATE page (dashboard, employees...).
//
// ROUTE GROUPS (not in Day 2): a folder name in parentheses, like (app) or (auth), organises files but is
// NOT part of the URL. app/(app)/dashboard/page.js is served at /dashboard, not /app/dashboard.
// Groups let different sets of pages share different layouts:
//   (auth)  login + register -> centered card, no navbar
//   (app)   everything else  -> navbar + login required
//
// A layout stays mounted while you move between its pages, so the Navbar is not re-created on every click.
// This file is a server component; it renders two client components (ProtectedRoute, Navbar).
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

export default function AppLayout({ children }) {
  return (
    <ProtectedRoute>
      <Navbar />
      <main className="container">{children}</main>
    </ProtectedRoute>
  );
}
