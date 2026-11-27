import { createContext, useCallback, useContext, useEffect, useState } from "react"; // the React tools used below
import { useNavigate } from "react-router-dom"; // lets code (not just links) change the page
import api from "../lib/api.js"; // our configured axios instance

const AuthContext = createContext(null); // a "channel" that can carry the auth data; null is the value when no provider exists

export function AuthProvider({ children }) { // wraps the app (see main.jsx); children = everything inside it
  const [user, setUser] = useState(null); // the logged-in user { id, name, email, role } or null
  const [loading, setLoading] = useState(true); // true until we know whether a session exists (prevents a flash of the login page)
  const navigate = useNavigate(); // function used to redirect after logout

  // Restore the session on every page load / refresh. The browser automatically sends the HttpOnly cookie.
  useEffect(() => { // runs once after the first render (empty dependency array below)
    api
      .get("/auth/me") // ask the backend "who am I?"
      .then((res) => setUser(res.data.data)) // 200: store the user the backend returned
      .catch(() => setUser(null)) // 401 / network error: nobody is logged in
      .finally(() => setLoading(false)); // either way we now know the answer
  }, []); // [] = run only once, on mount

  // useCallback keeps the same function identity between renders, which avoids needless re-renders of consumers.
  const login = useCallback(async (email, password) => { // returns a promise the Login page can await
    const res = await api.post("/auth/login", { email, password }); // backend checks the password and sets the cookie
    setUser(res.data.data); // remember who logged in
    return res.data.data; // let the caller use the user if it wants to
  }, []); // no outside values are used, so the dependency list is empty

  const register = useCallback(async (name, email, password) => { // create an account (the backend also logs us in)
    const res = await api.post("/auth/register", { name, email, password }); // role is not sent: the server always assigns "user"
    setUser(res.data.data); // the new user is logged in straight away
    return res.data.data; // same convention as login
  }, []);

  const logout = useCallback(async () => { // end the session
    try {
      await api.post("/auth/logout"); // the backend clears the cookie (only the server can remove an HttpOnly cookie)
    } finally { // finally runs even if the request failed, so the UI always logs out
      setUser(null); // forget the user in memory
      navigate("/login"); // send them to the login page
    }
  }, [navigate]); // navigate is used inside, so it is a dependency

  // Everything components may need, packaged in one object. isAdmin is derived: it can never get out of sync with user.
  const value = { user, loading, login, register, logout, isAdmin: user?.role === "admin" };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>; // every component below can now read `value`
}

// A custom hook so components write useAuth() instead of useContext(AuthContext).
export const useAuth = () => {
  const ctx = useContext(AuthContext); // read the nearest provider's value
  if (!ctx) throw new Error("useAuth must be used within AuthProvider"); // catches the common mistake of forgetting the provider
  return ctx; // { user, loading, login, register, logout, isAdmin }
};
