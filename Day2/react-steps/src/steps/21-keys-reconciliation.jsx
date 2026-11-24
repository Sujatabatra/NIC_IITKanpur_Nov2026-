// =====================================================================================
// STEP 21 - Keys and reconciliation
//
// When a list changes, React must decide which new element corresponds to which old element.
// The `key` is how it matches them:
//   - same key as before  -> reuse the element (keep its DOM node and any state, like typed text)
//   - new key             -> create a new element
//   - missing key         -> remove the element
// If you use the array INDEX as the key, the identity belongs to a POSITION, not to the item.
// Insert or reorder items and the typed text/state stays at the old position: wrong item!
// =====================================================================================

import { useState } from "react";

export const meta = {
  title: "Keys and reconciliation",
  concept: "Keys tell React which list item is which, so state and DOM nodes stay attached to the right item when the list changes.",
  newInThisStep: [
    "Index keys (key={i}) attach identity to a POSITION, not to the item",
    "Stable keys (key={item.id}) attach identity to the ITEM",
    "Type text into the boxes, then prepend an item: the difference appears",
    "Reconciliation compares the old and new trees: same type + key = update, different = replace",
  ],
  tryThis: [
    "Type 'AAA' in the first box of BOTH lists, click 'Prepend item' and compare",
    "Click 'Reverse' and watch where the typed text goes in each list",
    "Use Math.random() as a key and see why that is the worst choice (everything remounts)",
  ],
};

// A counter outside the component gives every new item a unique, permanent id.
let nextId = 4;

export default function Demo() {
  const [items, setItems] = useState([
    { id: 1, label: "Item A" },
    { id: 2, label: "Item B" },
    { id: 3, label: "Item C" },
  ]);

  // Add a new item at the START of the list (immutably, step 13)
  const prepend = () => setItems((list) => [{ id: nextId, label: `Item ${nextId++}` }, ...list]);
  // Copy first ([...list]) because reverse() would otherwise mutate the state array
  const reverse = () => setItems((list) => [...list].reverse());

  return (
    <div>
      <button onClick={prepend}>Prepend item</button>
      <button onClick={reverse}>Reverse</button>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 10 }}>
        <div>
          <h4 style={{ color: "#c92a2a" }}>Index keys (buggy)</h4>
          {/* The key is the position (0, 1, 2...). After prepending, the item that was at position 0
              is now at position 1, but React thinks "position 0 is the same element as before":
              it keeps position 0's <input> (and its typed text) and just changes the label next to it. */}
          {items.map((item, i) => (
            <div key={i}>
              {item.label} <input placeholder="type here" />
            </div>
          ))}
        </div>
        <div>
          <h4 style={{ color: "#2b8a3e" }}>Stable keys (correct)</h4>
          {/* The key is the item's own id. React moves each <input> together with its item,
              so the typed text always stays beside the right label. */}
          {items.map((item) => (
            <div key={item.id}>
              {item.label} <input placeholder="type here" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
