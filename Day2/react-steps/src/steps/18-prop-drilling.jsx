// =====================================================================================
// STEP 18 - Prop drilling: the problem Context (Day 2) solves
//
// Props only travel from a parent to its direct child. If a component deep in the tree needs a
// value, EVERY component in between must accept and forward it, even if they never use it.
// That is "prop drilling". It works, but it makes code noisy and fragile. Tomorrow you will
// learn the Context API and Redux Toolkit, which let a deep component read shared data directly.
// =====================================================================================

import { useState } from "react";

export const meta = {
  title: "Prop drilling",
  concept: "Passing a prop through many layers that do not use it is called prop drilling. It works, but it gets painful.",
  newInThisStep: [
    "user and onLogout travel App -> Layout -> Sidebar -> UserMenu",
    "Layout and Sidebar never use them; they only pass them along",
    "Adding one more value means editing every layer",
    "Day 2 fixes this with the Context API and Redux Toolkit",
  ],
  tryThis: [
    "Add a 'theme' value and count how many components you must edit to use it in UserMenu",
    "Rename the 'user' prop in UserMenu only and see what breaks",
    "Sketch how Context would let UserMenu read the user directly",
  ],
};

// LEVEL 3 (the only component that actually USES the data)
function UserMenu({ user, onLogout }) {
  return (
    <p>
      Signed in as <b>{user.name}</b> <button onClick={onLogout}>Logout</button>
    </p>
  );
}

// LEVEL 2: does not use user/onLogout. It only forwards them to its child (drilling).
function Sidebar({ user, onLogout }) {
  return (
    <div style={{ background: "#eef", padding: 8 }}>
      <b>Sidebar</b>
      <UserMenu user={user} onLogout={onLogout} />
    </div>
  );
}

// LEVEL 1: also just forwards the props to Sidebar (drilling).
function Layout({ user, onLogout }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 8 }}>
      <b>Layout</b>
      <Sidebar user={user} onLogout={onLogout} />
    </div>
  );
}

// LEVEL 0: the owner of the data
export default function Demo() {
  const [user, setUser] = useState({ name: "Asha" });
  return user ? (
    // The data and the callback start here and are passed down through every level
    <Layout user={user} onLogout={() => setUser(null)} />
  ) : (
    <button onClick={() => setUser({ name: "Asha" })}>Login again</button>
  );
}
