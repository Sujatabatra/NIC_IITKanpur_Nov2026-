// =====================================================================================
// STEP 05 - Rendering lists with map() and keys
//
// To show many items, keep them in an ARRAY of data and use array.map() (JS step 08) to turn
// each data item into a JSX element. React needs a unique `key` on each element so it can
// track which item is which when the list changes.
// =====================================================================================

export const meta = {
  title: "Lists and keys",
  concept: "Use array.map() to render many elements; give each one a stable, unique key.",
  newInThisStep: [
    "{items.map((item) => <li key={item.id}>...</li>)}",
    "key helps React tell items apart when the list changes",
    "Use an id from your data, not the array index (see step 21)",
    "Render rows of a table from an array of objects",
  ],
  tryThis: [
    "Add another object to the employees array and watch a new row appear",
    "Remove the key prop and read the console warning",
    "Render only the names as a bulleted list using map",
  ],
};

// Plain data. Later this will come from state, and later still from an API/database.
// Each record has a unique `id`, which makes a perfect key.
const employees = [
  { id: 1, name: "Asha", dept: "IT", salary: 60000 },
  { id: 2, name: "Ravi", dept: "HR", salary: 45000 },
  { id: 3, name: "Meera", dept: "IT", salary: 75000 },
];

export default function Demo() {
  return (
    <>
      <h4>Names-displaying using list</h4>
      <ul>
        {/* NEW: inside { } we can run JavaScript. map() returns an ARRAY of <li> elements,
            and React renders an array of elements one after another.
            key={e.id}: the key goes on the OUTERMOST element returned by the callback.
            It must be unique among siblings and must not change between renders. */}
        {employees.map((e) => (
          <li key={e.id}>{e.name}</li>
        ))}
      </ul>

      <h4>Employees- displaying using table</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Dept</th>
            <th>Salary</th>
          </tr>
        </thead>
        <tbody>
          {/* One <tr> per employee: same idea, more columns */}
          {employees.map((e) => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>{e.dept}</td>
              <td>{e.salary}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
