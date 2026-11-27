import { useEffect, useState } from "react"; // state plus effects for fetching
import { Link } from "react-router-dom"; // links to detail / edit / new pages
import api from "../lib/api.js"; // HTTP client
import { useAuth } from "../context/AuthContext.jsx"; // isAdmin decides which buttons appear
import useDebounce from "../hooks/useDebounce.js"; // delay the search so we do not call the API on every keystroke

const LIMIT = 5; // rows per page (small so pagination is easy to demo)

export default function EmployeeList() {
  const { isAdmin } = useAuth(); // admin-only buttons
  const [employees, setEmployees] = useState([]); // the rows of the CURRENT page
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 }); // pagination info sent by the backend
  const [departments, setDepartments] = useState([]); // options for the department filter
  const [search, setSearch] = useState(""); // what the user has typed (changes on every keystroke)
  const [department, setDepartment] = useState(""); // selected department id, "" = all
  const [status, setStatus] = useState(""); // "active" / "inactive" / "" = any
  const [page, setPage] = useState(1); // current page number
  const [reload, setReload] = useState(0); // a counter we bump to force a re-fetch after delete / toggle
  const [loading, setLoading] = useState(true); // show "Loading..." while a request is running
  const [error, setError] = useState(""); // error message
  const debouncedSearch = useDebounce(search, 400); // same text, but only updated after 400 ms of silence

  useEffect(() => { // load the filter options once
    api
      .get("/departments") // GET /api/departments
      .then((r) => setDepartments(r.data.data)) // keep the array
      .catch(() => {}); // the filter is a nice-to-have: ignore failures silently
  }, []); // only on mount

  // A new filter must start from the first page, otherwise we might ask for page 4 of a result that has only 1 page.
  useEffect(() => {
    setPage(1); // jump back to page 1
  }, [debouncedSearch, department, status]); // whenever any filter changes

  useEffect(() => { // THE data-fetching effect: re-runs whenever anything in the dependency list changes
    const controller = new AbortController(); // lets us cancel this request if a newer one replaces it
    setLoading(true); // show the loading text
    setError(""); // clear the old error
    api
      .get("/employees", { // GET /api/employees?search=..&department=..&status=..&page=..&limit=..
        params: { // axios turns this object into the query string
          search: debouncedSearch || undefined, // undefined values are left out of the URL, so "" is not sent
          department: department || undefined, // only filter when a department is chosen
          status: status || undefined, // only filter when a status is chosen
          page, // which page to fetch
          limit: LIMIT, // how many rows per page
        },
        signal: controller.signal, // connect the abort controller to this request
      })
      .then((r) => { // success
        setEmployees(r.data.data); // the array of employees
        setMeta(r.data.meta); // { total, page, limit, pages }
        setLoading(false); // hide the loading text
      })
      .catch((e) => { // failure
        if (!e.canceled) { // a cancelled request is expected (we did it), so it is not an error
          setError(e.message); // show the problem
          setLoading(false); // stop loading
        }
      });
    return () => controller.abort(); // cleanup: runs before the next effect, so a slow OLD response can never overwrite a NEW one
  }, [debouncedSearch, department, status, page, reload]); // re-fetch when any of these change

  const handleDelete = async (emp) => { // delete one employee
    if (!confirm(`Delete ${emp.name}? This cannot be undone.`)) return; // ask first; Cancel stops here
    try { // attempt the deletion
      await api.delete(`/employees/${emp._id}`); // DELETE /api/employees/:id (admin only, answers 204)
      setReload((n) => n + 1); // bump the counter -> the fetch effect runs again -> the row disappears
    } catch (e) { // e.g. 403 for non-admins
      alert(e.message); // simple feedback
    }
  };

  const toggleStatus = async (emp) => { // flip active <-> inactive
    try { // attempt the update
      await api.patch(`/employees/${emp._id}`, { status: emp.status === "active" ? "inactive" : "active" }); // PATCH sends only the changed field
      setReload((n) => n + 1); // refresh the list
    } catch (e) { // failure
      alert(e.message); // tell the user
    }
  };

  return ( // the page
    <>
      {/* heading with the total number of matches */}
      <h2>Employees ({meta.total})</h2>
      {/* row of filter controls */}
      <div className="toolbar">
        {/* search box: updates `search` on every keystroke; the API call waits for the debounced copy */}
        <input placeholder="Search name, email, position" value={search} onChange={(e) => setSearch(e.target.value)} />
        {/* department filter; value "" means "no filter" */}
        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
          {/* first option clears the filter */}
          <option value="">All departments</option>
          {/* one option per department */}
          {departments.map((d) => (
            <option key={d._id} value={d._id}>
              {d.name}
            </option>
          ))}
        </select>
        {/* status filter */}
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        {/* create button only for admins */}
        {isAdmin && (
          <Link className="btn" to="/employees/new">
            + Add
          </Link>
        )}
      </div>

      {/* error message, if any */}
      {error && <p className="error">{error}</p>}
      {/* three states: loading -> empty -> table (nested conditional expressions) */}
      {loading ? (
        <p className="muted">Loading...</p>
      ) : employees.length === 0 ? (
        <p className="muted">No employees found.</p>
      ) : (
        <table>
          {/* column headings */}
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
          {/* one row per employee; MongoDB's id field is _id */}
          <tbody>
            {employees.map((e) => (
              <tr key={e._id}>
                {/* name links to the detail page; the email is shown underneath */}
                <td>
                  <Link to={`/employees/${e._id}`}>{e.name}</Link>
                  <div className="muted">{e.email}</div>
                </td>
                {/* simple text columns; department was populated by the backend, so it is an object { _id, name } */}
                <td>{e.position}</td>
                <td>{e.department?.name}</td>
                {/* toLocaleString adds thousands separators */}
                <td>₹{e.salary.toLocaleString("en-IN")}</td>
                {/* status badge */}
                <td>
                  <span className="badge">{e.status}</span>
                </td>
                {/* action buttons */}
                <td>
                  {/* anyone can view */}
                  <Link className="btn secondary" to={`/employees/${e._id}`}>
                    View
                  </Link>{" "}
                  {/* the fragment <>...</> groups several elements without adding an extra DOM node; admin only */}
                  {isAdmin && (
                    <>
                      {/* open the edit form */}
                      <Link className="btn secondary" to={`/employees/${e._id}/edit`}>
                        Edit
                      </Link>{" "}
                      {/* arrow function so we can pass the row's employee to the handler */}
                      <button className="btn secondary" onClick={() => toggleStatus(e)}>
                        {e.status === "active" ? "Deactivate" : "Activate"}
                      </button>{" "}
                      {/* red delete button */}
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

      {/* pagination controls */}
      <div className="toolbar">
        {/* functional update (p) => p - 1 is safe even if several clicks are batched; disabled on the first page */}
        <button className="btn secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          ← Prev
        </button>
        {/* meta.pages || 1: avoid "Page 1 of 0" when there are no results */}
        <span>
          Page {meta.page} of {meta.pages || 1}
        </span>
        {/* disabled on the last page */}
        <button className="btn secondary" disabled={page >= meta.pages} onClick={() => setPage((p) => p + 1)}>
          Next →
        </button>
      </div>
    </>
  );
}
