// app/steps/03-nested-routes/page.js -> /steps/03-nested-routes
// This page is rendered INSIDE the nested layout (layout.js in this folder).
export default function SectionHome() {
  return (
    <>
      <h2>Section home</h2>
      <p>URL: /steps/03-nested-routes</p>
      <p>Use the section navigation above. The layout (banner + navigation) does not reload; only this area changes.</p>
    </>
  );
}
