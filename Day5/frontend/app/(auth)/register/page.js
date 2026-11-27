"use client";
// app/(auth)/register/page.js -> URL /register. Same ideas as the login page, plus field-level errors.
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null); // whole error object: {message, errors: [{field, message}]}

  // One handler for all three inputs: `name="..."` on each <input> tells us which key to update.
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await register(form.name, form.email, form.password); // POST /auth/register, then logged in automatically
      router.push("/dashboard");
    } catch (err) {
      setError(err); // the backend validation says e.g. "password: at least 8 characters"
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 440, margin: "60px auto" }}>
        <h2>Register</h2>
        <form className="stack" onSubmit={handleSubmit}>
          <input name="name" placeholder="Full name" required value={form.name} onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" required value={form.email} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password (min 8 characters)" required value={form.password} onChange={handleChange} />
          {error && (
            <div className="error">
              {error.message}
              <ul>
                {error.errors?.map((x) => (
                  <li key={x.field}>
                    {x.field}: {x.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button className="btn">Create account</button>
        </form>
        <p className="muted">
          Have an account? <Link href="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
