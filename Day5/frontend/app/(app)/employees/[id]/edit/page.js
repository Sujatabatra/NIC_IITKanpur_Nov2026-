"use client";
// app/(app)/employees/[id]/edit/page.js -> URL /employees/65f.../edit (admin only).
// Nested dynamic route: folders [id] then edit. Same EmployeeForm as the "new" page, now pre-filled.
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import EmployeeForm from "@/components/EmployeeForm";

export default function EditEmployee() {
  const { id } = useParams();
  const router = useRouter();
  const [emp, setEmp] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/employees/${id}`)
      .then((r) => setEmp(r.data.data))
      .catch((e) => setError(e.message));
  }, [id]);

  return (
    <ProtectedRoute roles={["admin"]}>
      <h2>Edit employee</h2>
      {error && <p className="error">{error}</p>}
      {/*
        The form is rendered only AFTER the data has arrived. useState(initial) uses its argument just on the
        FIRST render; if we rendered the form earlier it would start empty and never fill itself in.
      */}
      {emp && (
        <EmployeeForm
          submitLabel="Update"
          initial={{
            name: emp.name,
            email: emp.email,
            position: emp.position,
            salary: emp.salary,
            department: emp.department?._id, // the API returns a populated object -> the <select> needs its id
            status: emp.status,
          }}
          onSubmit={async (data) => {
            await api.put(`/employees/${id}`, data); // PUT = replace the whole document with the form values
            router.push(`/employees/${id}`);
          }}
        />
      )}
    </ProtectedRoute>
  );
}
