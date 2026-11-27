"use client";
// app/(auth)/login/page.js -> URL /login (the (auth) route group is not part of the URL).
//
// A "page" is just a React component exported as default from a file called page.js.
// It is a CLIENT component because it uses state, effects and event handlers.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  // One state object for the whole form; each field is a key.
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Already logged in (e.g. opened /login by hand after a refresh)? Skip the form.
  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [loading, user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // do not let the browser reload the page
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password); // POST /auth/login -> cookie is set by the backend
      router.push("/dashboard");
    } catch (err) {
      setError(err.message); // e.g. "Invalid email or password"; "Network Error" would mean CORS or backend down
    } finally {
      setSubmitting(false); // runs on success AND failure
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 440, margin: "60px auto" }}>
        <h2>Login</h2>
        <form className="stack" onSubmit={handleSubmit}>
          {/* controlled inputs: value comes from state, onChange writes back to state */}
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <span className="error">{error}</span>}
          <button className="btn" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="muted">
          No account? <Link href="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
