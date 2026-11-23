// =====================================================================================
// STEP 03 - Props: passing data into a component
//
// PROPS ("properties") are the INPUTS of a component, like the arguments of a function.
// The parent writes them as attributes; the child receives them as ONE object.
// Props are READ-ONLY: a component must never change the props it receives.
// =====================================================================================

export const meta = {
  title: "Props",
  concept: "Props make one component reusable with different data.",
  newInThisStep: [
    "Pass props as attributes: <EmployeeBadge name='Asha' />",
    "Receive them by destructuring the props object: ({ name, dept })",
    "Strings use quotes, everything else (numbers, booleans, objects) uses { }",
    "Default value for a missing prop: ({ dept = 'General' })",
  ],
  tryThis: [
    "Add a third EmployeeBadge with a different name and salary",
    "Remove the dept prop on one badge and see the default",
    "Try changing a prop inside the child (props.name = 'x') and read the error",
  ],
};

// ---- NEW: a component that receives props ---------------------------------------------------
// React calls EmployeeBadge({ name: "Asha", dept: "IT", ... }) with ONE object.
// Object destructuring (JS step 04) unpacks the fields we need right in the parameter list.
// `dept = "General"` is a default value used when the parent does not pass dept.
function EmployeeBadge({ name, dept = "General", salary, active }) {
  return (
    // Props can be used anywhere in the JSX: in text, in styles, in conditions.
    <div style={{ border: "1px solid #ccc", borderRadius: 8, padding: 10, margin: "8px 0", opacity: active ? 1 : 0.5 }}>
      <b>{name}</b> - {dept}
      <div>Salary: {salary.toLocaleString("en-IN")}</div>
      {/* condition ? valueIfTrue : valueIfFalse (a ternary): more on this in step 06 */}
      <small>{active ? "Active" : "Inactive"}</small>
    </div>
  );
}

export default function Demo() {
  const person = { name: "Meera", dept: "IT", salary: 85000, active: true };
  return (
    <div>
      {/* PASSING PROPS: name="Asha" is a string, so it uses quotes.
          Numbers and booleans must be inside { }: salary={60000}, active={true}. */}
      <EmployeeBadge name="Asha" dept="IT" salary={60000} active={true} />

      {/* dept is missing here, so the default value "General" is used */}
      <EmployeeBadge name="Ravi" salary={45000} active={false} />

      {/* {...person} spreads every property of the object into separate props (JS step 06) */}
      <EmployeeBadge {...person} />
    </div>
  );
}
