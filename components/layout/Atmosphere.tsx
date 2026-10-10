/**
 * Atmosphere — the fixed, slowly drifting canvas behind every page.
 * Sections sit on it transparently, so the site never breaks into
 * flat colour blocks.
 */
export default function Atmosphere() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere-orb atmosphere-orb--gold" />
      <div className="atmosphere-orb atmosphere-orb--sage" />
      <div className="atmosphere-grain" />
    </div>
  );
}
