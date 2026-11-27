// app/api/steps/employees/[id]/route.js - a DYNAMIC route handler.
//
// URL:   /api/steps/employees/3
// The folder [id] works exactly like in pages. In Next.js 15 the second argument is { params } where
// params is a PROMISE, so we await it.
//
// The four verbs of a REST API for ONE resource:
//   GET    read it                       -> 200, or 404 when it does not exist
//   PATCH  change some fields            -> 200 with the updated record
//   DELETE remove it                     -> 204 No Content (empty body)
// (You will design these properly with Express on Day 3.)

import { NextResponse } from "next/server";
import { getById, remove, update } from "@/lib/employeesStore";

export async function GET(request, { params }) {
  const { id } = await params;
  const employee = getById(id);
  if (!employee) return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  return NextResponse.json(employee);
}

export async function PATCH(request, { params }) {
  const { id } = await params;
  const changes = await request.json();
  const updated = update(id, changes);
  if (!updated) return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const removed = remove(id);
  if (!removed) return NextResponse.json({ message: "Employee not found" }, { status: 404 });
  return new Response(null, { status: 204 }); // 204: success, nothing to send back
}
