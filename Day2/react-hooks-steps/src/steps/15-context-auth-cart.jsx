// =====================================================================================
// STEP 15 - Several contexts working together: Auth and Cart
//
// An application usually needs more than one global value. Create ONE context per concern and
// nest the Providers. Components subscribe only to the contexts they use.
//
//   <AuthProvider>      who is logged in (user, login, logout)
//     <CartProvider>    shopping cart (items, add, remove, total)
//       <App />
//
// Also shown: a context can use useReducer-style actions internally, and DERIVED values (the cart total)
// are computed during render, not stored.
// =====================================================================================

import { createContext, useContext, useState } from "react";

export const meta = {
  title: "Multiple contexts: Auth and Cart",
  concept: "One context per concern, nested Providers, a custom hook for each, derived values computed on the fly.",
  newInThisStep: [
    "AuthContext (user, login, logout) and CartContext (items, addItem, removeItem)",
    "Provider nesting order: the inner Provider can use the outer one (CartProvider could read the user)",
    "Each custom hook has a guard against missing Providers",
    "total is derived from items with reduce, not stored in state",
  ],
  tryThis: [
    "Log in, add products, then log out: the cart stays because it is a separate context",
    "Make the cart clear itself on logout (hint: useAuth inside CartProvider + an effect)",
    "Add a quantity field to cart items",
  ],
};

// ============ Auth context =================================================================
const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null means logged out
  const login = (name) => setUser({ name });
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

// ============ Cart context =================================================================
const CartContext = createContext(null);

function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  // immutable updates (Day 1 steps 13-14)
  const addItem = (product) => setItems((list) => [...list, { ...product, cartId: Date.now() + Math.random() }]);
  const removeItem = (cartId) => setItems((list) => list.filter((i) => i.cartId !== cartId));

  // DERIVED value: calculated from items every render, never stored separately
  const total = items.reduce((sum, i) => sum + i.price, 0);

  return <CartContext.Provider value={{ items, addItem, removeItem, total }}>{children}</CartContext.Provider>;
}
function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

// ============ components ===================================================================
const products = [
  { id: 1, name: "Book", price: 300 },
  { id: 2, name: "Pen", price: 20 },
  { id: 3, name: "Bag", price: 750 },
];

function LoginBar() {
  const { user, login, logout } = useAuth(); // uses ONLY the auth context
  return user ? (
    <p>
      Signed in as <b>{user.name}</b> <button onClick={logout}>Logout</button>
    </p>
  ) : (
    <p>
      Not signed in <button onClick={() => login("Asha")}>Login as Asha</button>
    </p>
  );
}

function ProductList() {
  const { user } = useAuth(); // uses auth to decide if buying is allowed...
  const { addItem } = useCart(); // ...and cart to add items
  return (
    <div>
      {products.map((p) => (
        <button key={p.id} disabled={!user} onClick={() => addItem(p)}>
          Add {p.name} (Rs {p.price})
        </button>
      ))}
      {!user && <p className="err">Log in to add products.</p>}
    </div>
  );
}

function CartView() {
  const { items, removeItem, total } = useCart(); // uses ONLY the cart context
  return (
    <div className="card">
      <b>Cart ({items.length})</b>
      <ul>
        {items.map((i) => (
          <li key={i.cartId}>
            {i.name} - Rs {i.price} <button onClick={() => removeItem(i.cartId)}>remove</button>
          </li>
        ))}
      </ul>
      <p>
        Total: <b>Rs {total}</b>
      </p>
    </div>
  );
}

export default function Demo() {
  return (
    <AuthProvider>
      <CartProvider>
        <LoginBar />
        <ProductList />
        <CartView />
      </CartProvider>
    </AuthProvider>
  );
}
