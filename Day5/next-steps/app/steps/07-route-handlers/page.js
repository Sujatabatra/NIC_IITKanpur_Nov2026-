// =====================================================================================
// STEP 07 - Route Handlers: building an API inside Next.js
//
// URL (page):  /steps/07-route-handlers
// URLs (API):  /api/steps/employees            (GET list, POST create)
//              /api/steps/employees/3          (GET one, PATCH update, DELETE remove)
//
// Files:  app/api/steps/employees/route.js
//         app/api/steps/employees/[id]/route.js
//         lib/employeesStore.js              (the shared in-memory data)
//
// Try the GET URLs straight in the browser address bar. For POST/PATCH/DELETE use the buttons below
// (a Client Component calling fetch), Postman or the VS Code REST Client.
// =====================================================================================

import StepBanner from "@/components/StepBanner";
import ApiPlayground from "./ApiPlayground";

export default function RouteHandlersPage() {
  return (
    <>
      <StepBanner
        number={7}
        title="Route Handlers (API endpoints)"
        concept="route.js files export GET, POST, PATCH, DELETE functions that return JSON responses."
        path="/api/steps/employees"
        points={[
          "route.js exports functions named after HTTP methods",
          "NextResponse.json(data, { status })",
          "Dynamic API routes use [id] folders and await params",
          "Status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found",
        ]}
      />
      <p>
        {/* API URLs return JSON, not a page, so a plain <a> is correct here (not <Link>). */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        Open <a href="/api/steps/employees">/api/steps/employees</a> and{" "}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a href="/api/steps/employees?department=IT">/api/steps/employees?department=IT</a> in a new tab.
      </p>
      <ApiPlayground />
    </>
  );
}
