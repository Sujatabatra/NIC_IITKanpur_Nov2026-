import { Outlet } from "react-router-dom"; // placeholder where the matched child route is rendered
import Navbar from "./Navbar.jsx"; // the top bar

// The frame shared by every logged-in page: navbar on top, the current page underneath.
export default function AppLayout() {
  return ( // what this layout draws
    <>
      {/* the navbar stays mounted while you move between pages */}
      <Navbar />
      {/* container centres the content */}
      <main className="container">
        {/* React Router puts Dashboard / EmployeeList / ... here, depending on the URL */}
        <Outlet />
      </main>
    </>
  );
}
