// =====================================================================================
// STEP 01 - Your first page: file-system routing and Server Components
//
// URL:   /steps/01-first-page
// FILE:  app/steps/01-first-page/page.js
//
// HOW ROUTING WORKS
//   - The folders under `app` are the URL path:  app / steps / 01-first-page   ->   /steps/01-first-page
//   - The file `page.js` inside the folder is what is shown at that URL.
//   - A folder WITHOUT page.js is not a public URL (it is only a path segment).
//   - Other files in the folder (helpers, components) are never public: colocate them freely.
//
// SERVER COMPONENT (default)
//   Every component in the App Router is a Server Component unless you write "use client" (step 06).
//   It runs on the SERVER, only the resulting HTML is sent to the browser, and it ships no JavaScript
//   for itself. That is why you can use async/await here (step 05) and why you cannot use useState/useEffect.
//   The console.log below prints in the TERMINAL where `npm run dev` runs, NOT in the browser console.
// =====================================================================================

import StepBanner from "@/components/StepBanner";

export default function FirstPage() {
  console.log("Step 01 rendered on the server (look at your terminal)");

  return (
    <>
      <StepBanner
        number={1}
        title="Your first page"
        concept="A folder is a URL segment; page.js is the page. Components are Server Components by default."
        path="/steps/01-first-page"
        points={[
          "page.js with a default exported component",
          "Folders under app/ become the URL path",
          "Server Components render on the server (console.log goes to the terminal)",
          "The root layout (app/layout.js) wraps this page automatically",
        ]}
      />
      <div className="demo">
        <p>This page is the file app/steps/01-first-page/page.js.</p>
        <p>
          Rendered at: <b>{new Date().toLocaleTimeString()}</b> (reload the page: the server renders again)
        </p>
        <p>Right-click, View Page Source: the content is already in the HTML, sent by the server.</p>
      </div>
    </>
  );
}
