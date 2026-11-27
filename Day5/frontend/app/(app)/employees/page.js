"use client";
// app/(app)/employees/page.js -> URL /employees. The biggest page: search + filters + pagination + actions.
//
// Build it in layers when teaching:  plain fetch -> filters -> debounce -> pagination -> delete / toggle.
//
// KEY REACT IDEAS HERE
//   * many useState variables: each one is a piece of UI state (inputs, data, flags)
//   * ONE useEffect re-runs whenever any value in its dependency array changes -> that is how "change a
//     filter, get new data" works without writing any "on filter change" code
//   * cleanup with AbortController: cancel the previous request so a slow old answer can never overwrite a newer one
//   * "reload counter" trick: bumping a number in the dependency array forces a refetch after delete / toggle
import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import useDebounce from "@/hooks/useDebounce";

const LIMIT = 5; // rows per page (constant: defined outside the component)

export default function EmployeesPage() {
  const { isAdmin } = useAuth();

  // --- data from the server ---
  const [employees, setEmployees] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 }); // pagination info from the API
  const [departments, setDepartments] = useState([]);

  // --- what the user chose ---
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  // --- housekeeping ---
  const [reload, setReload] = useState(0); // change it to trigger a refetch
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // `search` changes on every keystroke; `debouncedSearch` only after the user pauses typing (400 ms).
  const debouncedSearch = useDebounce(search, 400);

  // 1) departments for the filter dropdown: once on mount
  useEffect(() => {
    api
      .get("/departments")
      .then((r) => setDepartments(r.data.data))
      .catch(() => {}); // the filter is optional; ignore failure
  }, []);

  // 2) any new filter starts again from page 1 (otherwise you could sit on page 4 of a 1-page result)
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, department, status]);

  // 3) THE data effect: runs on mount and whenever a filter, the page or `reload` changes
  useEffect(() => {
    const controller = new AbortController(); // lets us cancel this request
    setLoading(true);
    setError("");
    api
      .get("/employees", {
        params: {
          // axios turns `params` into ?search=..&department=..; undefined values are omitted entirely
          search: debouncedSearch || undefined,
          department: department || undefined,
          status: status || undefined,
          page,
          limit: LIMIT,
        },
        signal: controller.signal,
      })
      .then((r) => {
        setEmployees(r.data.data);
        setMeta(r.data.meta);
        setLoading(false);
      })
      .catch((e) => {
        if (!e.canceled) {
          // a cancelled request is expected, not an error to show
          setError(e.message);
          setLoading(false);
        }
      });
    return () => controller.abort(); // cleanup: runs before the next effect and on unmount
  }, [debouncedSearch, department, status, page, reload]);

  const handleDelete = async (emp) => {
    if (!confirm(`Delete ${emp.name}? This cannot be undone.`)) return;
    try {
      await api.delete(`/employees/${emp._id}`); // 204 No Content
      setReload((n) => n + 1); // refetch the list
    } catch (e) {
      alert(e.message); // e.g. 403 for a non-admin
    }
  };

  const toggleStatus = async (emp) => {
    try {
      // PATCH = change only this field (PUT would replace the whole employee)
      await api.patch(`/employees/${emp._id}`, { status: emp.status === "active" ? "inactive" : "active" });
      setReload((n) => n + 1);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <>
      <h2>Employees ({meta.total})</h2>

      <div className="toolbar">
        <input placeholder="Search name, email, position" value={search} onChange={(e) => setSearch(e.target.value)} />
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          <option value="">All departments</option>
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {isAdmin && (
          <Link className="btn" href="/employees/new">
            + Add
          </Link>
        )}
      </div>

      {error && <p className="error">{error}</p>}

      {/* nested ternary: loading -> empty -> table */}
      {loading ? (
        <p className="muted">Loading...</p>
      ) : employees.length === 0 ? (
        <p className="muted">No employees found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Position</th>
              <th>Department</th>
              <th>Salary</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e._id}>
                <td>
                  {/* dynamic URL built with a template string: /employees/65f... */}
                  <Link href={`/employees/${e._id}`}>{e.name}</Link>
                  <div className="muted">{e.email}</div>
                </td>
                <td>{e.position}</td>
                {/* department was populated by the backend (Day 4). Keep comments on their own line: text after </td> would become a stray space inside <tr> and cause a hydration error */}
                <td>{e.department?.name}</td>
                <td>₹{e.salary.toLocaleString("en-IN")}</td>
                <td>
                  <span className="badge">{e.status}</span>
                </td>
                <td>
                  <Link className="btn secondary" href={`/employees/${e._id}`}>
                    View
                  </Link>{" "}
                  {/* admin-only buttons; the backend rejects these calls for normal users anyway */}
                  {isAdmin && (
                    <>
                      <Link className="btn secondary" href={`/employees/${e._id}/edit`}>
                        Edit
                      </Link>{" "}
                      <button className="btn secondary" onClick={() => toggleStatus(e)}>
                        {e.status === "active" ? "Deactivate" : "Activate"}
                      </button>{" "}
                      {/* onClick={() => handleDelete(e)}: an arrow function so we can pass the row */}
                      <button className="btn danger" onClick={() => handleDelete(e)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="toolbar">
        <button className="btn secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          ← Prev
        </button>
        <span>
          Page {meta.page} of {meta.pages || 1}
        </span>
        <button className="btn secondary" disabled={page >= meta.pages} onClick={() => setPage((p) => p + 1)}>
          Next →
        </button>
      </div>
    </>
  );
}
