// app/page.js - the page for the URL "/".
// There is nothing to show at "/", so we just forward visitors to the dashboard.
// redirect() works in a server component: the browser is told "go to /dashboard" before any HTML is sent.
// (middleware.js has already sent logged-out visitors to /login, and the (app) layout double-checks.)
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/dashboard");
}
