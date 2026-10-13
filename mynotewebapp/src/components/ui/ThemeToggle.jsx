import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../features/theme/ThemeContext";

/** Renders as a sidebar row with `showLabel`, otherwise as an icon button. */
export default function ThemeToggle({ showLabel = false }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const Icon = isLight ? FiMoon : FiSun;
  const label = isLight ? "Dark mode" : "Light mode";
  return (
    <button
      type="button"
      className={showLabel ? "nav-link" : "icon-btn"}
      onClick={toggleTheme}
      aria-label={showLabel ? undefined : label}
      title={label}
    >
      <Icon aria-hidden="true" />
      {showLabel && label}
    </button>
  );
}
