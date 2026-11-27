import axios from "axios"; // axios: a library for making HTTP requests (nicer than fetch for JSON, errors and interceptors)

// One configured axios instance used by the whole app, so the URL and cookie settings live in a single place.
const api = axios.create({ // create a copy of axios with our defaults
  baseURL: import.meta.env.VITE_API_URL, // Vite replaces this with the value from the .env file (must start with VITE_)
  withCredentials: true, // send and accept cookies on cross-origin requests; the JWT lives in an HttpOnly cookie
});

// An interceptor runs for EVERY response, so error handling is written once instead of in every component.
api.interceptors.response.use( // register (successHandler, errorHandler)
  (res) => res, // success: hand the response through unchanged
  (error) => { // failure: any non-2xx status, a network error or a cancelled request lands here
    const status = error.response?.status; // HTTP status code; ?. because there is no response when the server is unreachable
    // 401 = not logged in / session expired. Skip the /auth/ calls (a wrong password is also a 401) and the login page itself.
    if (status === 401 && !error.config?.url?.includes("/auth/") && !window.location.pathname.startsWith("/login")) {
      window.location.href = "/login"; // a full page load also wipes any stale in-memory state
    }
    // Turn every failure into ONE predictable shape so components never have to dig through error.response.data.
    return Promise.reject({ // rejecting keeps the promise in the "failed" state for the caller's .catch()
      status, // numeric status code (undefined for network errors)
      message: error.response?.data?.message || error.message || "Something went wrong", // best available text, in this order
      errors: error.response?.data?.errors, // field-level validation errors from the backend (array) when present
      canceled: axios.isCancel(error), // true when we aborted the request ourselves (AbortController)
    });
  }
);

export default api; // components do: import api from "../lib/api.js"
