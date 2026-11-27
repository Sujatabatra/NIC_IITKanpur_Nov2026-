// app/layout.js - the ROOT LAYOUT (required in every Next.js App Router project).
//
// A layout wraps every page below it. The root layout must contain <html> and <body>.
// It does not re-render when you navigate between pages, so it is the place for things that stay
// the same everywhere: the navigation bar, fonts, global CSS, providers (Context/Redux) later on.
// `children` is the page (or nested layout) that Next.js puts inside.
//
// This is a SERVER COMPONENT (the default). It runs on the server and sends HTML to the browser.

import Link from "next/link";
import "./globals.css";

// `metadata` sets the <title> and <meta> tags. Pages can export their own metadata too.
export const metadata = {
  title: "Next.js step by step",
  description: "MERN training - Day 2 Next.js lessons",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="top">
          <strong style={{ color: "#fff" }}>Next.js steps</strong>
          {/* Link is Next.js's navigation component: client-side navigation without a full page reload */}
          <Link href="/">All steps</Link>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
