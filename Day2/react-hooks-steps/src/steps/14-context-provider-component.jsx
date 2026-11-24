// =====================================================================================
// STEP 14 - A real Context: a Provider component with state, plus a custom hook
//
// Step 13 provided a CONSTANT value. Real apps provide STATE and the functions that change it, so the
// whole tree can read and update it. The standard recipe (you will reuse it for every context):
//
//   1. const ThemeContext = createContext(null);
//   2. export function ThemeProvider({ children }) { holds useState, returns <ThemeContext.Provider value={{...}}> }
//   3. export function useTheme() { wraps useContext and throws a helpful error if used outside the Provider }
//   4. Wrap the part of the app that needs it in <ThemeProvider>.
// In a real project steps 1-3 live in their own file, e.g. src/context/ThemeContext.jsx.
// =====================================================================================

import { createContext, useContext, useState } from "react";

export const meta = {
  title: "Provider component and useTheme hook",
  concept: "Put state in a Provider component and expose it with a custom hook for clean, safe usage.",
  newInThisStep: [
    "ThemeProvider owns the state and passes { theme, toggleTheme } as the value",
    "children prop: the Provider wraps whatever you put inside it",
    "useTheme() custom hook hides useContext and gives a clear error when the Provider is missing",
    "Any component can READ the theme and CHANGE it (via toggleTheme)",
  ],
  tryThis: [
    "Click 'Toggle theme' in either component: both update",
    "Move one component outside <ThemeProvider> and read the error message",
    "Add a 'fontSize' value to the context and use it in both components",
  ],
};

// 1) the context object. null = "no Provider found", which our hook detects.
const ThemeContext = createContext(null);

// 2) the Provider component: owns the state.
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  // The `value` is what every consumer receives. An object lets us share several things at once.
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

// 3) the custom hook: the only way components should read this context.
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>"); // fails early with a clear message
  return ctx;
}

// ---- consumers --------------------------------------------------------------------------
function Header() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div style={{ padding: 10, background: theme === "dark" ? "#1e293b" : "#e2e8f0", color: theme === "dark" ? "#fff" : "#000" }}>
      <b>Header</b> (theme: {theme}) <button onClick={toggleTheme}>Toggle theme</button>
    </div>
  );
}

function Content() {
  const { theme } = useTheme(); // reads only
  return (
    <div style={{ padding: 10, marginTop: 6, background: theme === "dark" ? "#334155" : "#f8fafc", color: theme === "dark" ? "#fff" : "#000" }}>
      <b>Content</b> reads the same theme without receiving any props.
    </div>
  );
}

export default function Demo() {
  return (
    // 4) Everything inside shares one theme state.
    <ThemeProvider>
      <Header />
      <Content />
    </ThemeProvider>
  );
}
