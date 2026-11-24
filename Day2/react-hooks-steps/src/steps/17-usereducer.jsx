// =====================================================================================
// STEP 17 - useReducer: the idea behind Redux, inside one component
//
// useState is perfect for simple values. When state has several fields or many ways to change it,
// it is clearer to describe changes as ACTIONS and handle them in one pure function, a REDUCER:
//
//   reducer(currentState, action) -> newState
//
//   dispatch({ type: "add", payload: ... })  ->  React calls reducer(state, action)  ->  new state  ->  re-render
//
// A reducer must be PURE: same inputs, same output, no side effects, no mutation of the old state.
// Redux Toolkit (next steps) is exactly this idea, but global and with less typing.
// =====================================================================================

import { useReducer, useState } from "react";

export const meta = {
  title: "useReducer (state + actions)",
  concept: "Describe changes as actions and handle them in a pure reducer function. The foundation of Redux.",
  newInThisStep: [
    "const [state, dispatch] = useReducer(reducer, initialState)",
    "An action is a plain object: { type: 'add', payload: ... }",
    "The reducer switches on action.type and returns a NEW state",
    "All state-changing logic lives in one place, easy to test and to read",
  ],
  tryThis: [
    "Add, toggle and remove todos and watch the 'last action' line",
    "Add an action type 'clearDone' that removes finished todos",
    "Try to mutate state inside the reducer (state.todos.push) and see why it is wrong",
  ],
};

// ---- the reducer: a PURE function outside the component ------------------------------------
function todosReducer(state, action) {
  switch (action.type) {
    case "add":
      return { ...state, todos: [...state.todos, { id: Date.now(), text: action.payload, done: false }] };
    case "toggle":
      return { ...state, todos: state.todos.map((t) => (t.id === action.payload ? { ...t, done: !t.done } : t)) };
    case "remove":
      return { ...state, todos: state.todos.filter((t) => t.id !== action.payload) };
    default:
      return state; // unknown action: return the state unchanged
  }
}

const initialState = { todos: [{ id: 1, text: "Learn useReducer", done: false }] };

export default function Demo() {
  // dispatch(action) is how components ask for a change. React runs the reducer and stores the result.
  const [state, dispatch] = useReducer(todosReducer, initialState);
  const [text, setText] = useState("");
  const [lastAction, setLastAction] = useState(null);

  // small helper that also remembers the last action (only to display it in this lesson)
  const send = (action) => {
    setLastAction(action);
    dispatch(action);
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          send({ type: "add", payload: text });
          setText("");
        }}
      >
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="New todo" />
        <button>Add</button>
      </form>

      <ul>
        {state.todos.map((t) => (
          <li key={t.id}>
            <span style={{ textDecoration: t.done ? "line-through" : "none" }}>{t.text}</span>{" "}
            <button onClick={() => send({ type: "toggle", payload: t.id })}>toggle</button>
            <button onClick={() => send({ type: "remove", payload: t.id })}>remove</button>
          </li>
        ))}
      </ul>
      <p>
        <small>Last action: {lastAction ? JSON.stringify(lastAction) : "none"}</small>
      </p>
    </div>
  );
}
