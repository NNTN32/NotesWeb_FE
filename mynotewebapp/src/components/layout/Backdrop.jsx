import { usePageVisible } from "../../hooks/usePageVisible";

/**
 * Decorative ambient background, fixed behind the page.
 * Variants: "home" | "auth" | "notes" | "tasks" — defined in styles/backdrop.css,
 * animated in styles/motion.css. Hidden from assistive tech and never clickable.
 */
export default function Backdrop({ variant = "home" }) {
  const visible = usePageVisible();
  return (
    <div
      className={`backdrop backdrop--${variant}`}
      data-paused={visible ? undefined : ""}
      aria-hidden="true"
    >
      <span className="backdrop__blob backdrop__blob--1" />
      <span className="backdrop__blob backdrop__blob--2" />
      <span className="backdrop__blob backdrop__blob--3" />
      <span className="backdrop__pattern" />
      <span className="backdrop__grain" />
    </div>
  );
}
