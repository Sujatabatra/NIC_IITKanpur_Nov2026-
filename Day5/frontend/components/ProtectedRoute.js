"use client";
// components/ProtectedRoute.js - a "guard" component: shows its children only to allowed users.
//
// REACT LESSON - conditional rendering: a component may return different JSX depending on state.
// Three situations here: still checking -> message; not logged in -> (redirecting) message; wrong role -> 403;
// otherwise -> render `children` (the protected page).
//
// Frontend guards are for USER EXPERIENCE only. The backend still enforces 401 / 403 on every request,
// because anyone can edit JavaScript in their own browser.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

// Props: `children` = what to protect; `roles` (optional) = list of roles allowed, e.g. ["admin"].
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Navigating is a SIDE EFFECT, so it belongs in useEffect, not in the render body.
  // router.replace (not push) so the Back button does not return to the page that just bounced us.
  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]); // re-run whenever one of these values changes

  if (loading || !user) return <p className="container muted">Checking session...</p>;
  if (roles && !roles.includes(user.role)) {
    return <p className="container error">403 - You do not have access to this page.</p>;
  }
  return children;
}
