/** A small group of mutually exclusive options rendered as toggle buttons. */
export default function SegmentedControl({ label, options, value, onChange }) {
  return (
    <div
      className="segmented"
      role="group"
      aria-label={label}
      style={{
        "--segment-count": options.length,
        "--segment-index": Math.max(
          0,
          options.findIndex((option) => option.value === value),
        ),
      }}
    >
      {/* Sliding thumb behind the active option */}
      <span className="segmented__thumb" aria-hidden="true" />
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
