"use client";
// components/Navbar.js - the top bar shown on every logged-in page.
//
// REACT LESSONS:
//   * a component is a function that returns JSX (HTML-like syntax inside JavaScript)
//   * `{ ... }` inside JSX embeds any JavaScript expression: {user?.name}
//   * `{isAdmin && <Link/>}` renders the link ONLY when isAdmin is true (false renders nothing)
//   * onClick={logout} passes the function itself; React calls it when the button is clicked
//     (writing onClick={logout()} would call it immediately during render: a classic mistake)
import Link from "next/link"; // client-side navigation: no full page reload, pages are prefetched
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth(); // read from Context
  return (
    <nav className="nav">
      <strong>EMS</strong>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/employees">Employees</Link>
      {isAdmin && <Link href="/employees/new">Add Employee</Link>}
      <span className="spacer" /> {/* flexible empty space that pushes the rest to the right (see globals.css) */}
      <span>
        {user?.name} <span className="badge">{user?.role}</span>
      </span>
      <button className="btn secondary" onClick={logout}>
        Logout
      </button>
    </nav>
  );
}
