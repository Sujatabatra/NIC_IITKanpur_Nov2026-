import { Navigate } from "react-router-dom"; // declarative redirect
import { useAuth } from "../context/AuthContext.jsx"; // who is logged in?

// Frontend guards are for user experience only: the backend still enforces 401 / 403, because anyone can edit JavaScript in their browser.
export default function ProtectedRoute({ children, roles }) { // children = the page to protect; roles = optional list of allowed roles
  const { user, loading } = useAuth(); // session state from the context
  if (loading) return <p className="container muted">Checking session...</p>; // still asking /auth/me: do NOT redirect yet
  if (!user) return <Navigate to="/login" replace />; // not logged in: go to the login page (replace = no extra history entry)
  if (roles && !roles.includes(user.role)) { // a role list was given and this user's role is not in it
    return <p className="container error">403 - You do not have access to this page.</p>; // logged in but not allowed
  }
  return children; // all checks passed: show the protected page
}
