import { Routes, Route, Navigate, Link } from "react-router-dom"; // Routes = route table, Route = one entry, Navigate = redirect, Link = no-reload anchor
import ProtectedRoute from "./components/ProtectedRoute.jsx"; // blocks pages from logged-out users (and from the wrong role)
import AppLayout from "./components/AppLayout.jsx"; // navbar + page area shared by all logged-in pages
import Login from "./pages/Login.jsx"; // public page
import Register from "./pages/Register.jsx"; // public page
import Dashboard from "./pages/Dashboard.jsx"; // statistics page
import EmployeeList from "./pages/EmployeeList.jsx"; // searchable, paginated table
import EmployeeDetail from "./pages/EmployeeDetail.jsx"; // one employee
import EmployeeNew from "./pages/EmployeeNew.jsx"; // create form (admin only)
import EmployeeEdit from "./pages/EmployeeEdit.jsx"; // edit form (admin only)

// Shown when no route matches the URL (the React Router equivalent of Express's 404 handler).
function NotFound() { // a tiny component kept in this file because it is used only here
  return ( // what this component draws
    <div className="container">
      {/* className (not class) is how JSX sets a CSS class */}
      <h2>404 - Page not found</h2>
      {/* Link changes the URL without reloading the page */}
      <Link to="/dashboard">Go to dashboard</Link>
    </div>
  );
}

export default function App() { // the root component; main.jsx renders it
  return ( // the route table
    <Routes>
      {/* "/" has no page of its own, so redirect it; replace stops "back" from returning to "/" */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      {/* public pages: anyone can open them */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Layout route: it has NO path. Its element is rendered around every child route (via <Outlet /> inside AppLayout). */}
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        {/* child paths below are shown inside the layout; they need a logged-in user */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* the employee list */}
        <Route path="/employees" element={<EmployeeList />} />
        {/* roles={["admin"]}: a normal user who types this URL sees a 403 message. (Static "new" beats dynamic ":id": the router ranks routes, so order does not matter, unlike Express.) */}
        <Route path="/employees/new" element={<ProtectedRoute roles={["admin"]}><EmployeeNew /></ProtectedRoute>} />
        {/* ":id" is a URL parameter; the page reads it with useParams() */}
        <Route path="/employees/:id" element={<EmployeeDetail />} />
        {/* edit page, again admin only */}
        <Route path="/employees/:id/edit" element={<ProtectedRoute roles={["admin"]}><EmployeeEdit /></ProtectedRoute>} />
      </Route>

      {/* "*" matches everything else, so it must be the catch-all fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
