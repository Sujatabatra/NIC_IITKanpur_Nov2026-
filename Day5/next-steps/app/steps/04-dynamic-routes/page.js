// =====================================================================================
// STEP 04 - Dynamic routes: [id]
//
// URL:   /steps/04-dynamic-routes            (this list page)
//        /steps/04-dynamic-routes/3          (the [id] page with id = "3")
//        /steps/04-dynamic-routes/3?tab=jobs (the same page with a query string)
//
// A folder name in SQUARE BRACKETS is a variable part of the URL: app/.../[id]/page.js matches any single segment.
// The matched value arrives in the page as the `params` prop; the query string arrives as `searchParams`.
// IMPORTANT (Next.js 15): both `params` and `searchParams` are PROMISES, so you must `await` them.
// =====================================================================================

import Link from "next/link";
import StepBanner from "@/components/StepBanner";

export default function DynamicIndex() {
  return (
    <>
      <StepBanner
        number={4}
        title="Dynamic routes"
        concept="[id] folders match any value. Read it from params, and query strings from searchParams."
        path="/steps/04-dynamic-routes/[id]"
        points={[
          "app/.../[id]/page.js matches /3, /42, /abc ...",
          "params and searchParams are Promises in Next.js 15: await them",
          "Link href can include template strings and query strings",
          "One page file, any number of URLs",
        ]}
      />
      <div className="demo">
        <ul>
          {[1, 2, 3].map((id) => (
            <li key={id}>
              <Link href={`/steps/04-dynamic-routes/${id}`}>Employee {id}</Link> |{" "}
              <Link href={`/steps/04-dynamic-routes/${id}?tab=jobs`}>Employee {id} (jobs tab)</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
