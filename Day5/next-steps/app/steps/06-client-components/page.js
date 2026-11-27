// =====================================================================================
// STEP 06 - Client Components and the server/client boundary
//
// URL:   /steps/06-client-components
//
// SERVER COMPONENT (default)            CLIENT COMPONENT ("use client" at the top of the file)
//   runs on the server only               runs on the server for the first HTML AND in the browser
//   async/await, direct data access       useState, useEffect, useRef, event handlers (onClick)
//   no JavaScript sent to the browser     its JavaScript is sent to the browser ("hydration")
//   cannot use hooks or browser APIs      can use hooks and browser APIs (window, localStorage)
//
// GOLDEN RULE: keep components Server Components and add "use client" only to the SMALL interactive
// parts (a button, a form, a dropdown). A Server Component can render a Client Component and pass it
// serializable props (strings, numbers, arrays, plain objects), as done below.
// =====================================================================================

import StepBanner from "@/components/StepBanner";
import Counter from "./Counter";

export default function ClientComponentsPage() {
  // This value is computed on the server and passed to the client component as a prop.
  const serverTime = new Date().toLocaleTimeString();

  return (
    <>
      <StepBanner
        number={6}
        title="Client Components"
        concept='Add "use client" only where you need state, effects or event handlers.'
        path="/steps/06-client-components"
        points={[
          '"use client" at the top of Counter.js makes it a Client Component',
          "The page (Server Component) imports and renders it like any component",
          "Server data goes in as props (must be serializable)",
          "Client Components can NOT import Server Components, but can receive them as children",
        ]}
      />
      <div className="demo">
        <p>
          This page is a Server Component rendered at <b>{serverTime}</b>.
        </p>
        <Counter initial={10} renderedOnServerAt={serverTime} />
      </div>
    </>
  );
}
