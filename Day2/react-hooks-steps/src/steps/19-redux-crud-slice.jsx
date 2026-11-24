// =====================================================================================
// STEP 19 - A Redux Toolkit slice for a list (CRUD): employees
//
// Same slice idea, now with an array in the state and four reducers (create, update, delete, toggle).
// Inside createSlice reducers you can use direct "mutating" operations because of Immer:
//
//     state.list.push(item)                       instead of   return { ...state, list: [...state.list, item] }
//     state.list = state.list.filter(...)         (assigning a new array is fine too)
//     const e = state.list.find(...); e.name = ...  instead of copying with map
//
// Do NOT mix styles in one reducer: either mutate the draft state OR return a new value, not both.
// The `payload` is the single argument given to the action creator: addEmployee({ name, department }).
// =====================================================================================

import { useState } from "react";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";

export const meta = {
  title: "Redux Toolkit: CRUD slice",
  concept: "Model a list of records in a slice with add, update, remove and toggle reducers.",
  newInThisStep: [
    "initialState: { list: [...] }",
    "Reducers receive (state, action); action.payload carries the data",
    "Immer lets you write state.list.push(...) or find(...).done = true safely",
    "Components dispatch action creators and read the list with useSelector",
  ],
  tryThis: [
    "Add, edit (rename) and delete employees; watch actions in Redux DevTools",
    "Add a 'raiseSalary' reducer that increases one employee's salary by 10%",
    "Compare this slice to the Day 1 array-in-state code (steps 13 and 14): what stayed the same?",
  ],
};

// ---- slice ------------------------------------------------------------------------------------
const employeesSlice = createSlice({
  name: "employees",
  initialState: {
    list: [
      { id: 1, name: "Asha", department: "IT", active: true },
      { id: 2, name: "Ravi", department: "HR", active: true },
    ],
  },
  reducers: {
    // CREATE: push a new record. Immer converts this "mutation" to an immutable update.
    addEmployee: (state, action) => {
      state.list.push({ id: Date.now(), active: true, ...action.payload });
    },
    // UPDATE: find the record and change a field. payload = { id, changes }
    updateEmployee: (state, action) => {
      const emp = state.list.find((e) => e.id === action.payload.id);
      if (emp) Object.assign(emp, action.payload.changes);
    },
    // TOGGLE: payload is just the id
    toggleActive: (state, action) => {
      const emp = state.list.find((e) => e.id === action.payload);
      if (emp) emp.active = !emp.active;
    },
    // DELETE: assigning a new filtered array is also fine
    removeEmployee: (state, action) => {
      state.list = state.list.filter((e) => e.id !== action.payload);
    },
  },
});

const { addEmployee, updateEmployee, toggleActive, removeEmployee } = employeesSlice.actions;
const store = configureStore({ reducer: { employees: employeesSlice.reducer } });

// ---- components -------------------------------------------------------------------------------
function EmployeeForm() {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("IT");

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch(addEmployee({ name, department })); // the object becomes action.payload
    setName("");
  };

  return (
    <form onSubmit={submit} style={{ marginBottom: 12 }}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <select value={department} onChange={(e) => setDepartment(e.target.value)}>
        <option>IT</option>
        <option>HR</option>
        <option>Finance</option>
      </select>
      <button>Add</button>
    </form>
  );
}

function EmployeeTable() {
  const employees = useSelector((state) => state.employees.list);
  const dispatch = useDispatch();

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Dept</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {employees.map((e) => (
          <tr key={e.id}>
            <td>{e.name}</td>
            <td>{e.department}</td>
            <td>{e.active ? "Active" : "Inactive"}</td>
            <td>
              <button onClick={() => dispatch(toggleActive(e.id))}>Toggle</button>
              {/* payload with two parts: which record and what to change */}
              <button onClick={() => dispatch(updateEmployee({ id: e.id, changes: { name: e.name + "*" } }))}>Rename*</button>
              <button onClick={() => dispatch(removeEmployee(e.id))}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Demo() {
  return (
    <Provider store={store}>
      <EmployeeForm />
      <EmployeeTable />
    </Provider>
  );
}
