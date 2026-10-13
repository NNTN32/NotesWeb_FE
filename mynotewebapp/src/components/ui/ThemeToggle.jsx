import { FiMoon, FiSun } from "react-icons/fi";
import { useTheme } from "../../features/theme/ThemeContext";
import { withViewTransition } from "../../lib/motion";
import Animate from "./Animate";

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
      onClick={() => withViewTransition(toggleTheme)}
      aria-label={showLabel ? undefined : label}
      title={label}
    >
      {/* Re-keyed on change so the new icon turns in. */}
      <Animate as="span" key={theme} name="turn" className="theme-toggle__icon">
        <Icon aria-hidden="true" />
      </Animate>
      {showLabel && label}
    </button>
  );
}
