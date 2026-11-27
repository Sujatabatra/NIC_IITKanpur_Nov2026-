// app/layout.js - the ROOT LAYOUT: wraps EVERY page of the application. Required in every Next.js app.
//
// REACT LESSON - "composition" and `children`:
//   A component can receive other JSX between its tags. React passes it in as the special prop `children`.
//   <AuthProvider> {children} </AuthProvider> means: "render whatever page is current, but inside the
//   AuthProvider". Every component below can then call useAuth() to know who is logged in.
//
// This file is a SERVER component (no "use client"), yet it renders <AuthProvider>, which IS a client
// component. That is allowed: a server component may render client components. The reverse is not
// possible in the same file: a client component cannot import a server component (it can only receive one as children).
import "./globals.css"; // global styles, loaded once for the whole app
import { AuthProvider } from "@/context/AuthContext"; // "@/" = project root (see jsconfig.json)

// Metadata becomes the <title> and <meta> tags of the page. A page can export its own to override these.
// `template` adds " | Employee Management" after the title of any page that sets one.
export const metadata = {
  title: { default: "Employee Management", template: "%s | Employee Management" },
  description: "MERN training capstone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
