// =====================================================================================
// app/api/steps/employees/route.js - a ROUTE HANDLER (an API endpoint inside Next.js)
//
// URL:   /api/steps/employees
//
// A file named route.js exports one function per HTTP method: GET, POST, PUT, PATCH, DELETE ...
// Each receives a standard Web `Request` and returns a standard `Response` (NextResponse.json is a helper).
// A folder cannot contain BOTH page.js and route.js for the same URL.
// This is the "E" of MERN living inside Next.js: you will build the real Express API on Day 3.
// The data comes from lib/employeesStore.js (in memory, resets when the server restarts).
// =====================================================================================

import { NextResponse } from "next/server";
import { create, list } from "@/lib/employeesStore";

// GET /api/steps/employees   or   /api/steps/employees?department=IT
export async function GET(request) {
  // request.nextUrl.searchParams gives the query string
  const department = request.nextUrl.searchParams.get("department");
  return NextResponse.json(list(department)); // status 200 by default
}

// POST /api/steps/employees   with a JSON body { name, department }
export async function POST(request) {
  const body = await request.json(); // read the JSON body

  // basic validation: respond with 400 Bad Request when data is missing
  if (!body.name || !body.department) {
    return NextResponse.json({ message: "name and department are required" }, { status: 400 });
  }

  const created = create(body);
  return NextResponse.json(created, { status: 201 }); // 201 = Created
}
