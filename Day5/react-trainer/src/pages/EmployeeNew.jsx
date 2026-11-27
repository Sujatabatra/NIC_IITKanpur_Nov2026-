import { useNavigate } from "react-router-dom"; // redirect after saving
import api from "../lib/api.js"; // HTTP client
import EmployeeForm from "../components/EmployeeForm.jsx"; // the shared form

// The admin-only guard is applied in App.jsx (<ProtectedRoute roles={["admin"]}>), so this page only deals with creating.
export default function EmployeeNew() {
  const navigate = useNavigate(); // function that changes the URL
  return ( // page content
    <>
      {/* heading */}
      <h2>Register employee</h2>
      {/* the form owns its state; this page only says what "submit" means */}
      <EmployeeForm
        submitLabel="Create" // text on the button
        onSubmit={async (data) => { // called by the form with the validated values (salary already a number)
          await api.post("/employees", data); // POST /api/employees -> 201 Created; if it fails, the form shows the error
          navigate("/employees"); // success: show the list
        }}
      />
    </>
  );
}
