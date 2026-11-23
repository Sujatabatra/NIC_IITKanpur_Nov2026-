// =====================================================================================
// STEP 04 - props.children and reusable layout components
//
// `children` is a special prop: whatever you write BETWEEN the opening and closing tags of a
// component. It lets you build "wrapper" components (cards, panels, layouts) that do not
// need to know what goes inside them.
// =====================================================================================

export const meta = {
  title: "children and reusable Card",
  concept: "A wrapper component (Card) can frame any content passed between its tags.",
  newInThisStep: [
    "children: whatever you nest inside <Card> ... </Card>",
    "A reusable Card with a title prop AND children",
    "Components inside components (Card contains EmployeeBadge)",
    "Composition is preferred over copy-paste",
  ],
  tryThis: [
    "Put a table, an image or a button inside a Card",
    "Nest a Card inside another Card",
    "Add a 'footer' prop to Card and render it at the bottom",
  ],
};

// ---- NEW: a layout component that uses `children` ---------------------------------------------
// `title` is a normal prop (a string). `children` is the content between <Card> and </Card>.
// The Card draws the border and heading once; the content is different for every use.
function Card({ title, children }) {
  return (
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, margin: "10px 0", background: "#fafafa" }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {/* Wherever you write {children}, the nested content appears */}
      {children}
    </div>
  );
}

// A small component that will be placed INSIDE a Card
function EmployeeBadge({ name, dept }) {
  return (
    <p style={{ margin: "4px 0" }}>
      <b>{name}</b> ({dept})
    </p>
  );
}

export default function Demo() {
  return (
    <>
      {/* children = the <p> element */}
      <Card title="Welcome">
        <p>Any content can go inside a Card.</p>
      </Card>

      {/* children = two EmployeeBadge components (a component inside a component) */}
      <Card title="IT team">
        <EmployeeBadge name="Asha" dept="IT" />
        <EmployeeBadge name="Meera" dept="IT" />
      </Card>

      {/* A Card can even contain another Card: composition has no limit */}
      <Card title="Nested cards">
        <Card title="Inner card">
          <button onClick={() => alert("clicked")}>A button inside</button>
        </Card>
      </Card>
    </>
  );
}
