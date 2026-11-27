// =====================================================================================
// lib/api.js - the ONE place that knows how to talk to the backend.
//
// WHY a single axios instance?  Every component calls `api.get("/employees")` instead of repeating the
// base URL, cookie settings and error handling. Change it here, the whole app follows.
//
// REACT LESSON: this file has no React in it. Not everything in a React app is a component. Plain
// JavaScript modules (API clients, formatters, validators) keep components small and easy to read.
//
// CORS LESSON: this file is the FRONT END half of the CORS story (the backend half is
// day4/backend/src/config/cors.js).
//   Mode A - "direct + CORS" (default):  NEXT_PUBLIC_API_URL=http://localhost:5000/api
//       The browser calls port 5000 directly. Different origin -> the backend must send CORS headers and
//       we must send cookies on purpose: `withCredentials: true`.
//   Mode B - "proxy" (no CORS at all):   NEXT_PUBLIC_API_URL=/api   +   BACKEND_URL=http://localhost:5000
//       The browser calls its OWN origin (port 3000); next.config.mjs forwards /api/* to the backend on the
//       server side. Same origin -> the browser never applies CORS.
// =====================================================================================
import axios from "axios";

const api = axios.create({
  // Variables starting with NEXT_PUBLIC_ are copied INTO the browser bundle at build time. Never put
  // secrets in them. Variables without the prefix exist only on the server.
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // Send and accept cookies on cross-origin requests. Without it the browser ignores the login cookie
  // set by port 5000 and every protected call would answer 401.
  withCredentials: true,
});

// An INTERCEPTOR runs for every response before the calling component sees it.
api.interceptors.response.use(
  (res) => res, // success: pass the response through untouched
  (error) => {
    const status = error.response?.status; // HTTP status, or undefined when there was no response at all

    // Session expired / not logged in -> send the user to the login page.
    // Skip the /auth/ calls themselves (a wrong password is also 401 and must show its message instead),
    // and skip when we are already on /login (avoids a redirect loop).
    // `typeof window !== "undefined"`: this file may also be imported on the server where `window` does not exist.
    if (
      status === 401 &&
      typeof window !== "undefined" &&
      !error.config?.url?.includes("/auth/") &&
      !window.location.pathname.startsWith("/login")
    ) {
      window.location.href = "/login";
    }

    // Always reject with the SAME shape so every component can simply read `err.message` / `err.errors`.
    // `error.response` is missing when the request never got an answer, which is exactly what a CORS
    // block or a stopped backend looks like ("Network Error").
    return Promise.reject({
      status,
      message: error.response?.data?.message || error.message || "Something went wrong",
      errors: error.response?.data?.errors, // field-level validation errors from the backend
      canceled: axios.isCancel(error), // true when WE cancelled it with an AbortController (not a real failure)
    });
  }
);

export default api;
