"use client"; // uses state, effects and the router -> must run in the browser
// =====================================================================================
// context/AuthContext.js - "who is logged in?" available to EVERY component.
//
// REACT LESSON - Context:
//   Props pass data parent -> child, one level at a time. If 10 components deep need `user`, passing it
//   through every level ("prop drilling") is painful. Context is a shared box:
//     1. createContext()          make the box
//     2. <Context.Provider value> put data in the box (we do it once, in the root layout)
//     3. useContext(Context)      any component below reads from the box
//   When the value changes, every component that reads it re-renders.
// =====================================================================================
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next.js version of the router hook (NOT next/router)
import api from "@/lib/api";

// The box itself. `null` is the default used when a component is NOT inside the provider.
const AuthContext = createContext(null);

// The Provider component: owns the auth STATE and the functions that change it.
export function AuthProvider({ children }) {
  // REACT LESSON - state: a value React remembers between renders. Changing it with the setter
  // (setUser) makes React re-render the component and everything that reads it.
  const [user, setUser] = useState(null); // null = nobody logged in (or not known yet)
  const [loading, setLoading] = useState(true); // true until we know whether a session exists
  const router = useRouter();

  // REACT LESSON - useEffect: run code AFTER the component has been drawn. The empty array [] means
  // "only once, when the component first appears". Here: ask the backend who we are. The browser attaches
  // the HttpOnly cookie automatically, so after a page refresh the user is "remembered".
  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data.data)) // cookie valid -> store the user
      .catch(() => setUser(null)) // 401 -> nobody is logged in
      .finally(() => setLoading(false)); // either way, the question is answered
  }, []);

  // REACT LESSON - useCallback: keep the SAME function object between renders (unless its dependencies
  // change). Without it, every render creates new functions, and anything that lists them in a
  // dependency array would re-run needlessly. [] means "this function never needs to change".
  const login = useCallback(async (email, password) => {
    const res = await api.post("/auth/login", { email, password }); // backend sets the cookie in its response
    setUser(res.data.data);
    return res.data.data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    setUser(res.data.data);
    return res.data.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout"); // backend clears the cookie
    } finally {
      setUser(null); // forget the user even if the request failed
      router.push("/login");
    }
  }, [router]); // router is used inside, so it is a dependency

  return (
    // `value` is what every consumer receives. `isAdmin` is DERIVED state: computed from `user`, never stored separately.
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

// REACT LESSON - custom hook: a function starting with "use" that wraps other hooks.
// Components write `const { user } = useAuth()` instead of `useContext(AuthContext)` and get a clear error
// message if they forgot the provider.
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
