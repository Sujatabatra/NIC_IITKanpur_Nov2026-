import { Link } from "react-router-dom"; // navigation without a full page reload
import { useAuth } from "../context/AuthContext.jsx"; // user, logout and the isAdmin flag

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth(); // pull only what this component needs out of the context
  return ( // the top bar
    <nav className="nav">
      {/* brand name */}
      <strong>EMS</strong>
      {/* to="" is the target path; Link is an <a> that React Router intercepts */}
      <Link to="/dashboard">Dashboard</Link>
      {/* link to the list page */}
      <Link to="/employees">Employees</Link>
      {/* && renders the right side only when isAdmin is true: normal users never see this link */}
      {isAdmin && <Link to="/employees/new">Add Employee</Link>}
      {/* empty element with flex:1 pushes everything after it to the right edge */}
      <span className="spacer" />
      {/* ?. avoids a crash if user is briefly null */}
      <span>
        {user?.name} <span className="badge">{user?.role}</span>
      </span>
      {/* onClick={logout}: pass the function itself (no parentheses), React calls it on click */}
      <button className="btn secondary" onClick={logout}>
        Logout
      </button>
    </nav>
  );
}
