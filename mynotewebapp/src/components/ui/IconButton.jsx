/** Icon-only button. `label` is required so every icon has an accessible name. */
export default function IconButton({
  label,
  icon: Icon,
  variant,
  className = "",
  ...props
}) {
  return (
    <button
      type="button"
      className={`icon-btn ${variant ? `icon-btn--${variant}` : ""} ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon aria-hidden="true" />
    </button>
  );
}
