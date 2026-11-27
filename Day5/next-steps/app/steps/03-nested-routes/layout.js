// app/steps/03-nested-routes/layout.js - a NESTED LAYOUT.
//
// A layout.js wraps every page in its folder AND in all sub-folders. Layouts nest:
//   root layout (app/layout.js)  >  this layout  >  page
// Navigating between pages that share this layout does NOT re-mount it: its state (like the typed text
// below) and its scroll position are preserved. Only the changing `children` part is swapped.
// This is why layouts are perfect for sidebars, tabs and section headers.

import Link from "next/link";
import StepBanner from "@/components/StepBanner";

export default function NestedLayout({ children }) {
  return (
    <>
      <StepBanner
        number={3}
        title="Nested routes and layouts"
        concept="Folders inside folders make nested URLs. A layout.js wraps its whole subtree and stays mounted while you navigate inside it."
        points={[
          "/steps/03-nested-routes, /team and /team/members are three pages",
          "layout.js in a folder wraps all pages below it",
          "Layouts nest inside each other (root > this > page)",
          "The layout does not re-render or reset when you move between its pages",
        ]}
      />
      {/* This sub-navigation belongs to the section, so it lives in the layout */}
      <nav style={{ display: "flex", gap: 14, marginBottom: 10 }}>
        <Link href="/steps/03-nested-routes">Section home</Link>
        <Link href="/steps/03-nested-routes/team">Team</Link>
        <Link href="/steps/03-nested-routes/team/members">Members</Link>
      </nav>
      <div className="demo">
        {/* `children` is the current page */}
        {children}
      </div>
    </>
  );
}
