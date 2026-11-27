// app/steps/03-nested-routes/team/members/page.js -> /steps/03-nested-routes/team/members
// Three levels deep. Still wrapped by the layout two levels up (and by the root layout).
export default function MembersPage() {
  return (
    <>
      <h2>Members</h2>
      <p>URL: /steps/03-nested-routes/team/members</p>
      <ul>
        <li>Asha</li>
        <li>Ravi</li>
        <li>Meera</li>
      </ul>
    </>
  );
}
