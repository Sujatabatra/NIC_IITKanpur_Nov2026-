import { useEffect, useState } from "react"; // state and the fetch effect
import { Link, useNavigate, useParams } from "react-router-dom"; // useParams reads :id from the URL
import api from "../lib/api.js"; // HTTP client
import { useAuth } from "../context/AuthContext.jsx"; // admin check

export default function EmployeeDetail() {
  const { id } = useParams(); // for the route "/employees/:id", id is the text after /employees/
  const navigate = useNavigate(); // used to leave the page after deleting
  const { isAdmin } = useAuth(); // only admins see Edit / Delete
  const [emp, setEmp] = useState(null); // the employee, null until loaded
  const [error, setError] = useState(""); // e.g. "Employee not found" (404)

  useEffect(() => { // fetch whenever the id in the URL changes
    api
      .get(`/employees/${id}`) // GET /api/employees/:id
      .then((r) => setEmp(r.data.data)) // keep the employee
      .catch((e) => setError(e.message)); // show the error
  }, [id]); // re-run if the user navigates from one employee to another

  const handleDelete = async () => { // delete this employee
    if (!confirm("Delete this employee?")) return; // confirmation dialog
    await api.delete(`/employees/${id}`); // DELETE /api/employees/:id
    navigate("/employees"); // back to the list
  };

  if (error) { // failed state
    return (
      <p className="error">
        {/* message plus a way back */}
        {error} - <Link to="/employees">back to list</Link>
      </p>
    );
  }
  if (!emp) return <p className="muted">Loading...</p>; // loading state

  return ( // the details card
    <div className="card">
      {/* name with a status badge */}
      <h2>
        {emp.name} <span className="badge">{emp.status}</span>
      </h2>
      {/* one paragraph per field; <b> is the label */}
      <p>
        <b>Email:</b> {emp.email}
      </p>
      {/* job title */}
      <p>
        <b>Position:</b> {emp.position}
      </p>
      {/* department is a populated object, so we show its name */}
      <p>
        <b>Department:</b> {emp.department?.name}
      </p>
      {/* salary with Indian digit grouping */}
      <p>
        <b>Salary:</b> ₹{emp.salary.toLocaleString("en-IN")}
      </p>
      {/* the date arrives as an ISO string; convert it to a readable local date */}
      <p>
        <b>Joined:</b> {new Date(emp.joiningDate).toLocaleDateString()}
      </p>
      {/* back to the list */}
      <Link className="btn secondary" to="/employees">
        ← Back
      </Link>{" "}
      {/* admin-only actions */}
      {isAdmin && (
        <>
          {/* open the edit page for this id */}
          <Link className="btn" to={`/employees/${id}/edit`}>
            Edit
          </Link>{" "}
          {/* delete button */}
          <button className="btn danger" onClick={handleDelete}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}
