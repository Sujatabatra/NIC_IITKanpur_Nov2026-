// app/steps/04-dynamic-routes/[id]/page.js
// The folder name [id] is a placeholder. For the URL /steps/04-dynamic-routes/3 Next.js calls this page with
//   params       = Promise resolving to { id: "3" }           (always strings)
//   searchParams = Promise resolving to { tab: "jobs" }        (from ?tab=jobs)

import Link from "next/link";

export default async function EmployeePage({ params, searchParams }) {
  // await the Promises (Next.js 15). Destructure right away for readability.
  const { id } = await params;
  const { tab = "profile" } = await searchParams; // default value when ?tab is missing

  return (
    <div className="demo">
      <h2>Employee {id}</h2>
      <p>
        params.id = <b>{id}</b> (a string), searchParams.tab = <b>{tab}</b>
      </p>
      <p>
        <Link href={`/steps/04-dynamic-routes/${id}?tab=profile`}>Profile</Link> |{" "}
        <Link href={`/steps/04-dynamic-routes/${id}?tab=jobs`}>Jobs</Link> |{" "}
        <Link href={`/steps/04-dynamic-routes/${id}?tab=salary`}>Salary</Link>
      </p>
      <p>
        {/* the page content changes with the tab, driven only by the URL */}
        {tab === "profile" && "Profile details..."}
        {tab === "jobs" && "Job history..."}
        {tab === "salary" && "Salary history..."}
      </p>
      <Link href="/steps/04-dynamic-routes">Back to the list</Link>
    </div>
  );
}
