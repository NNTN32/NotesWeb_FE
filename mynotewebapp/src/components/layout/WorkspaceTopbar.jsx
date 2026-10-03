import { useLocation } from "react-router-dom";
import { FiChevronRight, FiSun } from "react-icons/fi";
import { WORKSPACE_NAVIGATION } from "../../app/navigation";

export default function WorkspaceTopbar() {
  const { pathname } = useLocation();
  const page = WORKSPACE_NAVIGATION.find((item) => item.to === pathname);
  return (
    <div className="ws-topbar">
      <div>
        <span>Your space</span>
        <FiChevronRight aria-hidden="true" />
        <strong>{page?.label}</strong>
      </div>
      <span className="ws-topbar-date">
        <FiSun aria-hidden="true" />
        {new Date().toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}
      </span>
    </div>
  );
}
