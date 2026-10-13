import { useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import Sidebar from "./Sidebar";
import Logo from "../ui/Logo";
import IconButton from "../ui/IconButton";

/** Layout for workspace pages: sidebar navigation + routed page content. */
export default function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef(null);
  const closeMenu = () => setMenuOpen(false);

  return (
    <div
      className="shell"
      onKeyDown={(event) => {
        if (event.key === "Escape" && menuOpen) {
          closeMenu();
          menuButton.current?.focus();
        }
      }}
    >
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <header className="mobile-bar">
        <IconButton
          ref={menuButton}
          label="Open menu"
          icon={FiMenu}
          aria-expanded={menuOpen}
          aria-controls="app-sidebar"
          onClick={() => setMenuOpen(true)}
        />
        <Logo />
      </header>
      <Sidebar open={menuOpen} onClose={closeMenu} />
      <main id="main-content" className="shell__main">
        <Outlet />
      </main>
    </div>
  );
}
