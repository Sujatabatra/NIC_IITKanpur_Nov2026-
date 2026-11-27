"use client";
// app/(app)/employees/new/page.js -> URL /employees/new (admin only).
// This page is tiny because the form lives in components/EmployeeForm.js. It only decides WHAT HAPPENS ON SUBMIT.
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import EmployeeForm from "@/components/EmployeeForm";

export default function NewEmployee() {
  const router = useRouter();
  return (
    // `roles` makes the guard stricter than the (app) layout: normal users see the 403 message
    <ProtectedRoute roles={["admin"]}>
      <h2>Register employee</h2>
      <EmployeeForm
        submitLabel="Create"
        // the parent passes a function down as a prop; the form calls it with the cleaned data
        onSubmit={async (data) => {
          await api.post("/employees", data); // throws on 400 / 409; the form catches it and shows the errors
          router.push("/employees"); // success: back to the list
        }}
      />
    </ProtectedRoute>
  );
}
