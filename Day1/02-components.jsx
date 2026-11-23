// =====================================================================================
// STEP 02 - Functional components and composition
//
// A COMPONENT is a function that returns JSX. Instead of one giant page, you build many small
// components and nest them, like building with Lego bricks. This is called COMPOSITION.
// =====================================================================================

export const meta = {
  title: "Components and composition",
  concept: "Build the UI from small functions that return JSX, and nest them like HTML tags.",
  newInThisStep: [
    "Component names start with a capital letter (Header, not header)",
    "Use a component like a tag: <Header />",
    "Composition: App contains Header, Content and Footer",
    "Each component can be reused and tested on its own",
  ],
  tryThis: [
    "Add a second <Footer /> inside Page and see it appear twice",
    "Rename Header to header (lowercase) and see React treat it as an HTML tag",
    "Draw the component tree on paper: Demo -> Page -> Header, Content, Footer",
  ],
};

// ---- NEW: three small, single-purpose components ------------------------------------------
// Each one returns JSX. Nothing else is needed for a component to work.
function Header() {
  return <h2 style={{ margin: 0 }}>MERN Employee Portal</h2>;
}

function Content() {
  return <p>This is the main content area.</p>;
}

function Footer() {
  return <small>© IIT Kanpur training</small>;
}

// ---- NEW: a component that is built from other components ------------------------------------
// We use our own components exactly like HTML tags: <Header />.
// The CAPITAL first letter matters: <header> means the HTML tag, <Header /> means our function.
function Page() {
  return (
    <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 8 }}>
      <Header />
      <Content />
      <Footer />
    </div>
  );
}

// The component tree is:  Demo -> Page -> (Header, Content, Footer)
export default function Demo() {
  return <Page />;
}
