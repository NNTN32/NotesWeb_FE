import AmbientBackground from "./AmbientBackground";

/** Shared page canvas; feature colors and entry motion live in the styles. */
export default function PageSurface({ variant, className = "", children }) {
  return (
    <div className={`workspace-page ${variant}-page ${className}`}>
      <AmbientBackground variant={variant} />
      {children}
    </div>
  );
}
