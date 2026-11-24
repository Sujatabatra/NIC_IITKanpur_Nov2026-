// =====================================================================================
// STEP 20 - Several slices and selectors
//
// A real store combines many slices: configureStore({ reducer: { employees, filters, ... } }).
// Each slice only manages its own part (state.employees, state.filters).
//
// SELECTORS are small functions that read (and derive) data from the state:
//     const selectVisible = (state) => state.employees.list.filter(...)
//   - Keep them next to the slice and reuse them in many components.
//   - useSelector re-renders a component only when the value RETURNED by the selector changes
//     (compared with ===), so select the smallest piece you need.
// WARNING: a selector that returns a NEW array/object every call (like a bare .filter) makes the component
// re-render on every store update. Use createSelector (memoised, see below) for derived data.
// =====================================================================================

import { useRef } from "react";
import { configureStore, createSelector, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

export const meta = {
  title: "Multiple slices and selectors",
  concept: "Combine slices in one store and read exactly what a component needs with selector functions.",
  newInThisStep: [
    "Two slices: employees (data) and filters (UI state such as search and department)",
    "Selector functions: selectVisibleEmployees combines both slices",
    "useSelector with a small selector re-renders only when that value changes",
    "Render counters show which components were re-rendered by which action",
  ],
  tryThis: [
    "Type in the search box: which counters rise? Click 'Add employee': which rise now?",
    "Change SearchBox to select the whole state instead of state.filters.search and watch its counter",
    "Add a 'sort by name' option to the filters slice",
  ],
};

// ---- slice 1: the data --------------------------------------------------------------------------
const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    list: [
      { id: 1, name: "Asha", department: "IT" },
      { id: 2, name: "Ravi", department: "HR" },
      { id: 3, name: "Meera", department: "IT" },
    ],
  },
  reducers: {
    addEmployee: (state) => {
      state.list.push({ id: Date.now(), name: `New ${state.list.length + 1}`, department: "Finance" });
    },
  },
});

// ---- slice 2: the filters (UI state) -------------------------------------------------------------
const filtersSlice = createSlice({
  name: "filters",
  initialState: { search: "", department: "All" },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setDepartment: (state, action) => {
      state.department = action.payload;
    },
  },
});

const { addEmployee } = employeesSlice.actions;
const { setSearch, setDepartment } = filtersSlice.actions;

const store = configureStore({
  reducer: { employees: employeesSlice.reducer, filters: filtersSlice.reducer },
});

// ---- selectors: functions (state) => value -----------------------------------------------------
const selectSearch = (state) => state.filters.search;
const selectDepartment = (state) => state.filters.department;
const selectEmployeeCount = (state) => state.employees.list.length;
// a DERIVED selector that uses BOTH slices.
// createSelector (from reselect, re-exported by Redux Toolkit) MEMOISES the result: the filter runs again only
// when one of its input selectors returns something different. Without it, .filter would return a brand-new array
// on every store update and re-render the component every time.
const selectList = (state) => state.employees.list;
const selectVisibleEmployees = createSelector([selectList, selectSearch, selectDepartment], (list, search, department) =>
  list.filter((e) => e.name.toLowerCase().includes(search.toLowerCase()) && (department === "All" || e.department === department))
);

// small helper to show how many times a component rendered
function useRenderCount() {
  const r = useRef(0);
  r.current += 1;
  return r.current;
}

// ---- components -------------------------------------------------------------------------------
function SearchBox() {
  const search = useSelector(selectSearch); // reads ONLY the search text
  const department = useSelector(selectDepartment);
  const dispatch = useDispatch();
  const renders = useRenderCount();
  return (
    <p>
      <input placeholder="Search" value={search} onChange={(e) => dispatch(setSearch(e.target.value))} />
      <select value={department} onChange={(e) => dispatch(setDepartment(e.target.value))}>
        <option>All</option>
        <option>IT</option>
        <option>HR</option>
        <option>Finance</option>
      </select>
      <small> SearchBox renders: {renders}</small>
    </p>
  );
}

function CountBadge() {
  const count = useSelector(selectEmployeeCount); // only changes when an employee is added or removed
  const renders = useRenderCount();
  return (
    <p>
      Total employees: <b>{count}</b> <small>(CountBadge renders: {renders})</small>
    </p>
  );
}

function VisibleList() {
  const visible = useSelector(selectVisibleEmployees);
  const dispatch = useDispatch();
  const renders = useRenderCount();
  return (
    <div>
      <button onClick={() => dispatch(addEmployee())}>Add employee</button> <small>VisibleList renders: {renders}</small>
      <ul>
        {visible.map((e) => (
          <li key={e.id}>
            {e.name} ({e.department})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Demo() {
  return (
    <Provider store={store}>
      <SearchBox />
      <CountBadge />
      <VisibleList />
    </Provider>
  );
}
