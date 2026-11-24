// main.jsx - the entry point of every Vite + React app.
// index.html contains <div id="root"></div>; this file tells React to draw the app inside it.

import { StrictMode } from "react"; // a helper that runs extra checks in development
import { createRoot } from "react-dom/client"; // connects React to the browser page
import "./index.css"; // importing a CSS file applies the styles to the whole app
import App from "./App.jsx"; // the root component

// createRoot(domElement).render(jsx): start React inside the #root element.
createRoot(document.getElementById("root")).render(
  // StrictMode renders components TWICE in development (not in production) to reveal hidden bugs,
  // such as missing cleanup or code that changes state while rendering. This is why some console
  // logs appear twice and render counters may jump by 2 in the lessons.
  <StrictMode>
    <App />
  </StrictMode>
);
