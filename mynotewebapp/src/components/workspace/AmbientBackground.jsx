import "../../styles/ambient.css";

/** Purely decorative, CSS-only motion. Keep the page content outside this layer. */
export default function AmbientBackground({ variant }) {
  return (
    <div className={`ambient ambient--${variant}`} aria-hidden="true">
      <span className="ambient__wash" />
      <span className="ambient__pattern" />
      <span className="ambient__motif ambient__motif--one" />
      <span className="ambient__motif ambient__motif--two" />
      <span className="ambient__motif ambient__motif--three" />
    </div>
  );
}
