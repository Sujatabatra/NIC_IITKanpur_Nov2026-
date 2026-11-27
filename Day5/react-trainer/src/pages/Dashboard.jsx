import { useEffect, useState } from "react"; // state for the data, effect to fetch it
import { Link } from "react-router-dom"; // navigation links
import api from "../lib/api.js"; // HTTP client
import { useAuth } from "../context/AuthContext.jsx"; // user name and the admin flag

const inr = (n) => `₹${Number(n).toLocaleString("en-IN")}`; // helper: 1250000 -> "₹12,50,000" (Indian digit grouping)

export default function Dashboard() {
  const { user, isAdmin } = useAuth(); // who is logged in, and are they an admin?
  const [stats, setStats] = useState(null); // null = "not loaded yet"
  const [error, setError] = useState(""); // message if the request fails

  useEffect(() => { // fetch once when the page opens
    api
      .get("/employees/stats") // the MongoDB aggregation endpoint from Day 4
      .then((r) => setStats(r.data.data)) // store { total, avgSalary, totalSalary, byDepartment }
      .catch((e) => setError(e.message)); // show the failure
  }, []); // [] = only on mount

  if (error) return <p className="error">{error}</p>; // early return: failed state
  if (!stats) return <p className="muted">Loading dashboard...</p>; // early return: loading state (stats is still null)

  return ( // the page once data exists
    <>
      {/* personalised greeting */}
      <h2>Welcome, {user.name}</h2>
      {/* auto-fitting grid of three statistic cards */}
      <div className="grid">
        {/* card 1: head count */}
        <div className="card stat">
          <span className="muted">Employees</span>
          <b>{stats.total}</b>
        </div>
        {/* card 2: average salary, formatted */}
        <div className="card stat">
          <span className="muted">Average salary</span>
          <b>{inr(stats.avgSalary)}</b>
        </div>
        {/* card 3: total payroll */}
        <div className="card stat">
          <span className="muted">Total payroll</span>
          <b>{inr(stats.totalSalary)}</b>
        </div>
      </div>
      {/* department breakdown card */}
      <div className="card">
        {/* card title */}
        <h3>By department</h3>
        {/* a table: header row first */}
        <table>
          <thead>
            <tr>
              <th>Department</th>
              <th>Employees</th>
              <th>Avg salary</th>
            </tr>
          </thead>
          {/* one row per department; map turns data into JSX; key must be unique per row */}
          <tbody>
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
      {/* className on a Link styles it like a button; {" "} adds a visible space between inline elements */}
      <Link className="btn" to="/employees">
        View employees
      </Link>{" "}
      {/* only admins may create employees, so only they see this button */}
      {isAdmin && (
        <Link className="btn secondary" to="/employees/new">
          Add employee
        </Link>
      )}
    </>
  );
}
