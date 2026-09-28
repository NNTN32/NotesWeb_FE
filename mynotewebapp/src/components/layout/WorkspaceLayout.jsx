import { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu, FiBookOpen } from "react-icons/fi";
import SideMenu from "../SideMenu";
import "../../styles/workspace.css";
export default function WorkspaceLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef(null);
  const close = () => setMobileOpen(false);
  return (
    <div
      className="workspace-theme ws-shell"
      onKeyDown={(event) => {
        if (event.key === "Escape" && mobileOpen) {
          close();
          toggleRef.current?.focus();
        }
      }}
    >
      <a className="ws-skip" href="#workspace-content">
        Skip to main content
      </a>
      <header className="ws-mobile-bar">
        <button
          ref={toggleRef}
          className="ws-icon-button"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          aria-controls="workspace-navigation"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <FiMenu />
        </button>
        <span>
          <FiBookOpen />
          MyNote.
        </span>
      </header>
      <SideMenu mobileOpen={mobileOpen} onClose={close} />
      <main id="workspace-content" className="ws-main">
        <Outlet />
        <footer className="ws-footer">
          <span>MyNote · A little space, just for you.</span>
          <span>Capture. Organize. Breathe.</span>
        </footer>
      </main>
    </div>
  );
}
