import { useEffect, useState } from "react"; // state and the fetch effect
import { useNavigate, useParams } from "react-router-dom"; // :id from the URL, and redirects
import api from "../lib/api.js"; // HTTP client
import EmployeeForm from "../components/EmployeeForm.jsx"; // the same form as the "new" page

export default function EmployeeEdit() { // admin-only: the guard is in App.jsx
  const { id } = useParams(); // which employee to edit
  const navigate = useNavigate(); // redirect after saving
  const [emp, setEmp] = useState(null); // the current values, null until loaded
  const [error, setError] = useState(""); // load error

  useEffect(() => { // load the employee to pre-fill the form
    api
      .get(`/employees/${id}`) // GET /api/employees/:id
      .then((r) => setEmp(r.data.data)) // keep it
      .catch((e) => setError(e.message)); // show the problem
  }, [id]); // again if the id changes

  return ( // page content
    <>
      {/* heading */}
      <h2>Edit employee</h2>
      {/* load error, if any */}
      {error && <p className="error">{error}</p>}
      {/* Render the form ONLY after the data arrived: useState(initial) in the form reads `initial` just once, on first render. */}
      {emp && (
        <EmployeeForm
          submitLabel="Update" // button text
          initial={{ // values that pre-fill the inputs
            name: emp.name, // text fields copy straight across
            email: emp.email,
            position: emp.position,
            salary: emp.salary,
            department: emp.department?._id, // department is a populated object; the <select> needs just its id
            status: emp.status,
          }}
          onSubmit={async (data) => { // called with the edited values
            await api.put(`/employees/${id}`, data); // PUT replaces the document: all fields are sent, so all are required
            navigate(`/employees/${id}`); // success: show the updated employee
          }}
        />
      )}
    </>
  );
}
