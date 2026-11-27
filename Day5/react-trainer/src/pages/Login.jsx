import { useState } from "react"; // state for the form fields, error and submit status
import { Link, Navigate, useNavigate } from "react-router-dom"; // Link = anchor, Navigate = redirect element, useNavigate = redirect from code
import { useAuth } from "../context/AuthContext.jsx"; // login() and the current user

export default function Login() {
  const { user, loading, login } = useAuth(); // session state plus the login function
  const navigate = useNavigate(); // used to go to the dashboard after a successful login
  const [form, setForm] = useState({ email: "", password: "" }); // controlled inputs live in one object
  const [error, setError] = useState(""); // message to show under the fields
  const [submitting, setSubmitting] = useState(false); // true while the request is running

  // Already logged in? Skip the login page. (All hooks are above this line: hooks must never sit after a conditional return.)
  if (!loading && user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => { // runs when the form is submitted
    e.preventDefault(); // stop the browser's own full-page submit
    setError(""); // clear any previous error
    setSubmitting(true); // disable the button
    try { // attempt the login
      await login(form.email, form.password); // POST /auth/login; the server sets the HttpOnly cookie
      navigate("/dashboard"); // success: go to the dashboard
    } catch (err) { // wrong password, validation error, server down...
      setError(err.message); // api.js guarantees err.message exists
    } finally { // runs in both cases
      setSubmitting(false); // re-enable the button
    }
  };

  return ( // the page
    <div className="container">
      {/* style={{...}}: the outer braces mean "JavaScript here", the inner braces are the style object */}
      <div className="card" style={{ maxWidth: 440, margin: "60px auto" }}>
        {/* page heading */}
        <h2>Login</h2>
        {/* onSubmit fires on button click AND on pressing Enter in a field */}
        <form className="stack" onSubmit={handleSubmit}>
          {/* controlled input: value from state, change writes back to state; { ...form } keeps the other field */}
          <input type="email" placeholder="Email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          {/* type="password" hides the characters */}
          <input type="password" placeholder="Password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {/* show the error only when there is one */}
          {error && <span className="error">{error}</span>}
          {/* a button inside a form submits it; disabled prevents double clicks */}
          <button className="btn" disabled={submitting}>
            {submitting ? "Signing in..." : "Login"}
          </button>
        </form>
        {/* link to the other public page */}
        <p className="muted">
          No account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
