// lib/employeesStore.js - a tiny in-memory "database" shared by the route handlers in step 07.
//
// Why a separate file? Both app/api/steps/employees/route.js and app/api/steps/employees/[id]/route.js need
// the SAME data, and route.js files may only export HTTP method functions (GET, POST ...), so shared code
// goes in a normal module that both import.
// A module-level variable lives as long as the server process runs, so the data resets when the server
// restarts. In Day 4 this is replaced by MongoDB.

let employees = [
  { id: 1, name: "Asha", department: "IT" },
  { id: 2, name: "Ravi", department: "HR" },
  { id: 3, name: "Meera", department: "IT" },
];

export const list = (department) => (department ? employees.filter((e) => e.department === department) : employees);

export const getById = (id) => employees.find((e) => e.id === Number(id));

export const create = ({ name, department }) => {
  const created = { id: Date.now(), name, department };
  employees = [...employees, created]; // immutable add (Day 1 step 13)
  return created;
};

export const update = (id, changes) => {
  let updated = null;
  employees = employees.map((e) => {
    if (e.id !== Number(id)) return e;
    updated = { ...e, ...changes };
    return updated;
  });
  return updated;
};

export const remove = (id) => {
  const before = employees.length;
  employees = employees.filter((e) => e.id !== Number(id));
  return employees.length < before;
};
