"use client";
// app/(app)/employees/[id]/page.js -> URL /employees/65f1c2... (a DYNAMIC route).
// The folder name [id] is a placeholder: whatever is in that part of the URL becomes `params.id`.
// In a client component we read it with the useParams() hook.
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeDetails() {
  const { id } = useParams(); // the [id] segment of the URL
  const router = useRouter();
  const { isAdmin } = useAuth();
  const [emp, setEmp] = useState(null);
  const [error, setError] = useState("");

  // `id` is in the dependency array: navigating from one employee to another (same component, new id) refetches.
  useEffect(() => {
    api
      .get(`/employees/${id}`)
      .then((r) => setEmp(r.data.data))
      .catch((e) => setError(e.message)); // 404 "Employee not found" or invalid id
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this employee?")) return;
    await api.delete(`/employees/${id}`);
    router.push("/employees");
  };

  if (error) {
    return (
      <p className="error">
        {error} - <Link href="/employees">back to list</Link>
      </p>
    );
  }
  if (!emp) return <p className="muted">Loading...</p>;

  return (
    <div className="card">
      <h2>
        {emp.name} <span className="badge">{emp.status}</span>
      </h2>
      <p>
        <b>Email:</b> {emp.email}
      </p>
      <p>
        <b>Position:</b> {emp.position}
      </p>
      <p>
        <b>Department:</b> {emp.department?.name}
      </p>
      <p>
        <b>Salary:</b> ₹{emp.salary.toLocaleString("en-IN")}
      </p>
      <p>
        <b>Joined:</b> {new Date(emp.joiningDate).toLocaleDateString()}
      </p>
      <Link className="btn secondary" href="/employees">
        ← Back
      </Link>{" "}
      {isAdmin && (
        <>
          <Link className="btn" href={`/employees/${id}/edit`}>
            Edit
          </Link>{" "}
          <button className="btn danger" onClick={handleDelete}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}
