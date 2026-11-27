import { StrictMode } from "react"; // StrictMode adds extra development-only checks (it runs effects twice to expose bugs)
import { createRoot } from "react-dom/client"; // createRoot attaches React to a real DOM element
import { BrowserRouter } from "react-router-dom"; // BrowserRouter enables client-side routing using the browser's address bar
import App from "./App.jsx"; // the root component that decides which page to show
import { AuthProvider } from "./context/AuthContext.jsx"; // shares the logged-in user with every component
import "./index.css"; // load the global styles once; they apply to the whole app

createRoot(document.getElementById("root")).render( // find <div id="root"> from index.html and render React inside it
  <StrictMode>
    {/* BrowserRouter must wrap everything that uses <Link>, <Route> or routing hooks */}
    <BrowserRouter>
      {/* AuthProvider is INSIDE the router because its logout() function navigates to /login */}
      <AuthProvider>
        {/* App contains the route table: URL -> page */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
