// app/steps/02-link-navigation/about/page.js  ->  URL: /steps/02-link-navigation/about
// A second page, so the links in the previous step have somewhere to go. Notice the folder nesting:
// the URL is simply the folder path.

import Link from "next/link";
import ActiveLink from "../ActiveLink"; // shared component from the parent folder

export default function AboutPage() {
  return (
    <div className="demo">
      <h2>About page</h2>
      <nav style={{ display: "flex", gap: 12 }}>
        <ActiveLink href="/steps/02-link-navigation">Back to step 02</ActiveLink>
        <ActiveLink href="/steps/02-link-navigation/about">About</ActiveLink>
      </nav>
      <p>
        <Link href="/">Home</Link>
      </p>
    </div>
  );
}
