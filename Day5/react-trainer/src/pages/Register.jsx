import { useState } from "react"; // form and error state
import { Link, useNavigate } from "react-router-dom"; // Link for the login link, useNavigate to redirect after success
import { useAuth } from "../context/AuthContext.jsx"; // register()

export default function Register() {
  const { register } = useAuth(); // the register function from the context
  const navigate = useNavigate(); // redirect helper
  const [form, setForm] = useState({ name: "", email: "", password: "" }); // all three fields in one object
  const [error, setError] = useState(null); // keep the whole error object: we need .message AND .errors

  // One handler for all inputs: the input's name attribute ("name", "email" or "password") picks the key to update.
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value }); // [..] = computed property name

  const handleSubmit = async (e) => { // runs on submit
    e.preventDefault(); // no browser reload
    setError(null); // clear the old error
    try { // attempt registration
      await register(form.name, form.email, form.password); // POST /auth/register (also logs the user in)
      navigate("/dashboard"); // straight to the app
    } catch (err) { // e.g. 409 "Email already registered" or 400 "password must be at least 8 characters"
      setError(err); // show it
    }
  };

  return ( // the page
    <div className="container">
      {/* centred narrow card */}
      <div className="card" style={{ maxWidth: 440, margin: "60px auto" }}>
        {/* heading */}
        <h2>Register</h2>
        {/* the form */}
        <form className="stack" onSubmit={handleSubmit}>
          {/* name field: name="name" matches the key in form state */}
          <input name="name" placeholder="Full name" required value={form.name} onChange={handleChange} />
          {/* email field */}
          <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
          {/* password field: the backend requires at least 8 characters */}
          <input name="password" type="password" placeholder="Password (min 8 characters)" required value={form.password} onChange={handleChange} />
          {/* error block, only when an error exists */}
          {error && (
            <div className="error">
              {/* general message */}
              {error.message}
              {/* per-field messages; the field name is unique so it can be the React key */}
              <ul>
                {error.errors?.map((x) => (
                  <li key={x.field}>
                    {x.field}: {x.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* submit button */}
          <button className="btn">Create account</button>
        </form>
        {/* link back to login */}
        <p className="muted">
          Have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
