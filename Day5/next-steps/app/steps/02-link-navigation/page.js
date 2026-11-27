// =====================================================================================
// STEP 02 - Navigation with <Link>
//
// URL:   /steps/02-link-navigation   and   /steps/02-link-navigation/about
//
// <a href="/x">   -> the browser loads a whole new page (full reload, all state lost, slower)
// <Link href="/x"> -> Next.js swaps only the changed part of the page ("client-side navigation"):
//                     no full reload, layouts stay mounted, and Next.js PREFETCHES the target page in the
//                     background when the link is visible, so the click feels instant.
//
// ActiveLink (see ActiveLink.js in this folder) shows how to highlight the current page using the
// usePathname hook. Hooks need a Client Component, so ActiveLink starts with "use client".
// =====================================================================================

import Link from "next/link";
import StepBanner from "@/components/StepBanner";
import ActiveLink from "./ActiveLink";

export default function LinkPage() {
  return (
    <>
      <StepBanner
        number={2}
        title="Link and navigation"
        concept="Use <Link> for navigation inside the app: no full reload, with automatic prefetching."
        path="/steps/02-link-navigation"
        points={[
          "<Link href='/path'> instead of <a>",
          "Prefetching of visible links in the background",
          "usePathname() (client hook) to mark the active link",
          "A plain <a> does a full page reload (compare the two links below)",
        ]}
      />
      <div className="demo">
        <p>
          <Link href="/steps/02-link-navigation/about">Link to About (client-side navigation)</Link>
        </p>
        <p>
          <a href="/steps/02-link-navigation/about">Plain anchor to About (full page reload)</a>
        </p>
        <p>
          Tip: open DevTools, Network tab, then click each one. Link fetches only a small payload; the anchor reloads the document.
        </p>
        <nav style={{ display: "flex", gap: 12 }}>
          <ActiveLink href="/steps/02-link-navigation">This page</ActiveLink>
          <ActiveLink href="/steps/02-link-navigation/about">About</ActiveLink>
        </nav>
      </div>
    </>
  );
}
