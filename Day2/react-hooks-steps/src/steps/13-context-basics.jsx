// =====================================================================================
// STEP 13 - Context API basics: skip the middle layers
//
// PROBLEM (Day 1 step 18): prop drilling. A value needed deep in the tree must be passed through
// every component in between.
//
// SOLUTION: React Context. Three parts:
//   1. createContext(defaultValue)       -> creates the "channel"
//   2. <MyContext.Provider value={...}>  -> a component higher up PUTS a value into the channel
//   3. useContext(MyContext)             -> ANY component below it READS the value directly
// Components in between do not need to know about it at all.
// =====================================================================================

import { createContext, useContext } from "react";

export const meta = {
  title: "Context API basics",
  concept: "createContext + Provider + useContext let a deep component read a value without prop drilling.",
  newInThisStep: [
    "const ThemeContext = createContext('light'): the default is used when there is no Provider above",
    "<ThemeContext.Provider value='dark'> makes the value available to everything inside it",
    "useContext(ThemeContext) reads the closest Provider's value",
    "Layout and Sidebar no longer pass anything along",
  ],
  tryThis: [
    "Change the Provider value from 'dark' to 'light' and watch the deep button change",
    "Remove the Provider: the component falls back to the default value of createContext",
    "Add a second Provider with a different value around only the Sidebar: the closest one wins",
  ],
};

// 1) Create the context. The argument is the DEFAULT value (used when no Provider is above the consumer).
const ThemeContext = createContext("light");

// Deep component: reads the value directly with useContext. No props!
function ThemedButton() {
  const theme = useContext(ThemeContext); // 3) read from the closest Provider above
  const styles = {
    light: { background: "#fff", color: "#000", border: "1px solid #999" },
    dark: { background: "#222", color: "#fff", border: "1px solid #222" },
  };
  return <button style={styles[theme]}>I am a {theme} button</button>;
}

// Middle layers: they know NOTHING about the theme and pass NO props. Compare with Day 1 step 18.
function Sidebar() {
  return (
    <div style={{ padding: 8, background: "#eef" }}>
      Sidebar <ThemedButton />
    </div>
  );
}
function Layout() {
  return (
    <div style={{ padding: 8, border: "1px solid #ccc" }}>
      Layout <Sidebar />
    </div>
  );
}

export default function Demo() {
  return (
    // 2) Provide a value to everything inside. Try changing "dark" to "light".
    <ThemeContext.Provider value="dark">
      <Layout />
    </ThemeContext.Provider>
  );
}
