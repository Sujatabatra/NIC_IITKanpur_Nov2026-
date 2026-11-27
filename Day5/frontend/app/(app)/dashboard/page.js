"use client";
// app/(app)/dashboard/page.js -> URL /dashboard.
// The classic "fetch on mount" page: three states to handle - loading, error, data.
//
// REACT LESSON: render = f(state). The same component returns a different screen depending on which
// state variable is set: error -> message, no stats yet -> "Loading...", otherwise the dashboard.
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

// A small helper OUTSIDE the component: created once, not on every render. Formats 450000 as ₹4,50,000.
const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`;

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [stats, setStats] = useState(null); // null = not loaded yet
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/employees/stats") // Day 4 MongoDB aggregation endpoint
      .then((r) => setStats(r.data.data))
      .catch((e) => setError(e.message));
  }, []);

  // "Early returns" keep the main JSX free of if/else clutter.
  if (error) return <p className="error">{error}</p>;
  if (!stats) return <p className="muted">Loading dashboard...</p>;

  return (
    <>
      {/* <>...</> is a Fragment: groups siblings without adding an extra HTML element */}
      <h2>Welcome, {user.name}</h2>
      <div className="grid">
        <div className="card stat">
          <span className="muted">Employees</span>
          <b>{stats.total}</b>
        </div>
        <div className="card stat">
          <span className="muted">Average salary</span>
          <b>{inr(stats.avgSalary)}</b>
        </div>
        <div className="card stat">
          <span className="muted">Total payroll</span>
          <b>{inr(stats.totalSalary)}</b>
        </div>
      </div>
      <div className="card">
        <h3>By department</h3>
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Employees</th>
              <th>Avg salary</th>
            </tr>
          </thead>
          <tbody>
            {/* one <tr> per array item; key must be unique among siblings */}
            {stats.byDepartment.map((d) => (
              <tr key={d.department}>
                <td>{d.department}</td>
                <td>{d.count}</td>
                <td>{inr(d.avgSalary)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link className="btn" href="/employees">
        View employees
      </Link>{" "}
      {isAdmin && (
        <Link className="btn secondary" href="/employees/new">
          Add employee
        </Link>
      )}
    </>
  );
}
