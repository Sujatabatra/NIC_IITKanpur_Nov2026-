// =====================================================================================
// STEP 21 (bonus) - Async work in Redux Toolkit: createAsyncThunk
//
// Reducers must be pure and synchronous, so they cannot fetch data. For async work Redux Toolkit has
// createAsyncThunk(typePrefix, async (arg) => result). It dispatches THREE actions for you:
//     <prefix>/pending     -> the request started
//     <prefix>/fulfilled   -> success, action.payload = the value you returned
//     <prefix>/rejected    -> failure, action.error = the error
// You handle them in `extraReducers` of the slice and store { items, status, error }.
// Compare with step 04 / 10: the same loading, error and success idea, but the state is GLOBAL.
// (Many teams use RTK Query or TanStack Query for server data; this shows the core mechanism.)
// =====================================================================================

import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

export const meta = {
  title: "Async data with createAsyncThunk (bonus)",
  concept: "createAsyncThunk runs an async function and dispatches pending, fulfilled and rejected actions automatically.",
  newInThisStep: [
    "createAsyncThunk('users/fetch', async () => { ... return data })",
    "extraReducers + builder.addCase(thunk.pending / fulfilled / rejected, ...)",
    "State shape: { items, status: 'idle' | 'loading' | 'succeeded' | 'failed', error }",
    "dispatch(fetchUsers()) starts the request from a component",
  ],
  tryThis: [
    "Open Redux DevTools and watch the pending and fulfilled actions arrive",
    "Press 'Fetch with an error' and see the rejected case",
    "Show a Retry button only when status is 'failed'",
  ],
};

// ---- the thunk: an async function that returns the payload ----------------------------------------
// `arg` is what you pass to dispatch(fetchUsers(arg)). Throwing an error makes the thunk REJECT.
const fetchUsers = createAsyncThunk("users/fetch", async (shouldFail = false) => {
  const url = shouldFail ? "https://jsonplaceholder.typicode.com/nope" : "https://jsonplaceholder.typicode.com/users?_limit=5";
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // becomes action.payload of the fulfilled action
});

// ---- the slice: reacts to the three actions the thunk generates -------------------------------
const usersSlice = createSlice({
  name: "users",
  initialState: { items: [], status: "idle", error: null },
  reducers: {}, // no normal reducers needed in this lesson
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

const store = configureStore({ reducer: { users: usersSlice.reducer } });

function Users() {
  const { items, status, error } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(fetchUsers())}>Fetch users</button>
      <button onClick={() => dispatch(fetchUsers(true))}>Fetch with an error</button>
      <p>
        status: <b>{status}</b>
      </p>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p style={{ color: "red" }}>Error: {error}</p>}
      <ul>
        {items.map((u) => (
          <li key={u.id}>
            {u.name} - {u.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Demo() {
  return (
    <Provider store={store}>
      <Users />
    </Provider>
  );
}
