// =====================================================================================
// STEP 18 - Redux Toolkit basics: store, slice, Provider, useSelector, useDispatch
//
// REDUX = ONE global store holding the app's state. The rules:
//   - State is read-only. The only way to change it is to DISPATCH an ACTION.
//   - A REDUCER (pure function) takes the old state + the action and returns the new state.
//
// REDUX TOOLKIT (RTK) is the official, simplified way to write it:
//   createSlice({ name, initialState, reducers })  -> a "slice" = state + reducers + auto-generated action creators
//   configureStore({ reducer: { counter: slice.reducer } })  -> the store
//   <Provider store={store}>                        -> makes the store available to all components (react-redux)
//   useSelector(state => ...)                       -> READ a piece of state; re-renders when that piece changes
//   useDispatch()                                   -> get dispatch to SEND actions
//
// DATA FLOW:  click -> dispatch(action) -> reducer -> new state in store -> useSelector -> component re-renders
// In a real project the slice goes to src/store/counterSlice.js and the store to src/store/store.js.
// =====================================================================================

import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

export const meta = {
  title: "Redux Toolkit: store, slice, hooks",
  concept: "A single store, state changed only by dispatching actions handled by reducers, written with createSlice.",
  newInThisStep: [
    "createSlice({ name, initialState, reducers }) generates action creators (counterSlice.actions)",
    "configureStore({ reducer: { counter: counterSlice.reducer } }) builds the store",
    "<Provider store={store}> at the top, useSelector to read, useDispatch to send actions",
    "Inside reducers you may 'mutate' state: Redux Toolkit uses Immer and still produces a new immutable state",
  ],
  tryThis: [
    "Install the Redux DevTools browser extension, click the buttons and watch each action and the state diff",
    "Add a 'reset' reducer and a button for it",
    "Add an `incrementBy(amount)` reducer that uses action.payload",
  ],
};

// ---- 1) the slice: initial state + reducers ---------------------------------------------------
const counterSlice = createSlice({
  name: "counter", // used as the prefix of action types: "counter/increment"
  initialState: { value: 0 },
  reducers: {
    // Each reducer receives the current state (and the action). Thanks to Immer you may write "mutating"
    // code; Redux Toolkit turns it into a correct immutable update behind the scenes.
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // action.payload is whatever you pass when dispatching: addAmount(5) -> payload 5
    addAmount: (state, action) => {
      state.value += action.payload;
    },
  },
});

// createSlice generated one action creator for every reducer: increment(), decrement(), addAmount(5)
const { increment, decrement, addAmount } = counterSlice.actions;

// ---- 2) the store: combines all slices ---------------------------------------------------------
// The key ("counter") becomes the name under state: state.counter.value
const store = configureStore({ reducer: { counter: counterSlice.reducer } });

// ---- 3) components use hooks to talk to the store ----------------------------------------------
function Counter() {
  // useSelector(fn): fn receives the WHOLE state and returns the part you need.
  // The component re-renders only when the returned value changes.
  const value = useSelector((state) => state.counter.value);

  // useDispatch() returns the dispatch function. dispatch(increment()) sends { type: "counter/increment" }.
  const dispatch = useDispatch();

  return (
    <div>
      <h3>Count: {value}</h3>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(addAmount(5))}>+5</button>
    </div>
  );
}

// A second component showing the SAME state: the store is shared (no props needed).
function Mirror() {
  const value = useSelector((state) => state.counter.value);
  return <p>Another component reads the same value: {value}</p>;
}

export default function Demo() {
  // 4) Provider makes the store available to every component below it.
  return (
    <Provider store={store}>
      <Counter />
      <Mirror />
    </Provider>
  );
}
