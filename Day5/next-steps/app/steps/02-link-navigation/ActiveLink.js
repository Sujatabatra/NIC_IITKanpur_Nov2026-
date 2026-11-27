"use client";
// ActiveLink.js - a Client Component (see the "use client" line above).
//
// "use client" must be the FIRST line of the file (comments are allowed before it).
// It marks a boundary: this file and everything it imports run in the browser too, so hooks and event
// handlers work. usePathname() returns the current URL path ("/steps/02-link-navigation/about").

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ActiveLink({ href, children }) {
  const pathname = usePathname(); // re-renders this component when the URL changes
  const active = pathname === href;
  return (
    <Link href={href} style={{ fontWeight: active ? "bold" : "normal", textDecoration: active ? "underline" : "none" }}>
      {children}
      {active ? " (you are here)" : ""}
    </Link>
  );
}
