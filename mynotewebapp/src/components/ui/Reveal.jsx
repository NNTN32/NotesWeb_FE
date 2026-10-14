import { useInView } from "../../hooks/useInView";
import { staggerStyle } from "../../lib/motion";

/**
 * Rises its content in the first time it scrolls into view (styles in
 * motion.css, ".reveal"). Children can react to `[data-revealed]` too,
 * e.g. to play a one-off animation once the section is visible.
 */
export default function Reveal({
  as: Tag = "div",
  index,
  className = "",
  style,
  ...props
}) {
  const [ref, inView] = useInView({ threshold: 0.2, once: true });
  return (
    <Tag
      ref={ref}
      className={`reveal ${className}`}
      data-revealed={inView ? "" : undefined}
      style={index === undefined ? style : { ...staggerStyle(index), ...style }}
      {...props}
    />
  );
}
