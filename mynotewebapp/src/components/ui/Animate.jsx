import { ENTER, staggerStyle } from "../../lib/motion";

/**
 * Plays an enter animation once when mounted. Change `key` on the element to
 * replay it (e.g. key={date} to animate on navigation).
 *
 *   <Animate name="rise" index={2}>…</Animate>
 */
export default function Animate({
  name = "fade",
  index,
  as: Tag = "div",
  className = "",
  style,
  ...props
}) {
  return (
    <Tag
      className={`${ENTER[name]} ${className}`}
      style={index === undefined ? style : { ...staggerStyle(index), ...style }}
      {...props}
    />
  );
}
