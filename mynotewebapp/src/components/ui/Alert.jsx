import Animate from "./Animate";

/** Renders nothing when there is no message, so callers can pass errors directly. */
export default function Alert({ children }) {
  if (!children) return null;
  return (
    <Animate as="p" name="slideUp" className="alert" role="alert">
      {children}
    </Animate>
  );
}
