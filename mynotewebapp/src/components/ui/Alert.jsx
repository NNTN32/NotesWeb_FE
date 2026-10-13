/** Renders nothing when there is no message, so callers can pass errors directly. */
export default function Alert({ children }) {
  if (!children) return null;
  return (
    <p className="alert" role="alert">
      {children}
    </p>
  );
}
