import { NavLink } from "react-router-dom";
import { FiLogIn, FiLogOut, FiX } from "react-icons/fi";
import Logo from "../ui/Logo";
import IconButton from "../ui/IconButton";
import ThemeToggle from "../ui/ThemeToggle";
import { ENTER } from "../../lib/motion";
import { WORKSPACE_NAVIGATION } from "../../app/navigation";
import { useAuth } from "../../features/auth/AuthContext";
import { useAuthModal } from "../../features/auth/AuthModalContext";

export default function Sidebar({ open, onClose }) {
  const { user, logout, restoring, signingOut, sessionError } = useAuth();
  const { openLogin } = useAuthModal();

  return (
    <>
      {open && (
        <button
          type="button"
          className={`sidebar__backdrop ${ENTER.fade}`}
          aria-label="Close menu"
          onClick={onClose}
        />
      )}
      <aside
        id="app-sidebar"
        className={`sidebar ${open ? "sidebar--open" : ""}`}
      >
        <div className="sidebar__top">
          <Logo onClick={onClose} />
          <IconButton
            label="Close menu"
            icon={FiX}
            className="sidebar__close"
            onClick={onClose}
          />
        </div>

        <nav className="sidebar__nav" aria-label="Workspace">
          {WORKSPACE_NAVIGATION.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link--active" : ""}`
              }
            >
              <Icon aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar__bottom">
          {sessionError && <p className="alert">{sessionError}</p>}
          <ThemeToggle showLabel />
          {user ? (
            <>
              <button
                type="button"
                className="nav-link"
                onClick={logout}
                disabled={signingOut}
              >
                <FiLogOut aria-hidden="true" />
                {signingOut ? "Signing out…" : "Sign out"}
              </button>
              <p className="sidebar__user">
                {user.name || user.username || user.email}
              </p>
            </>
          ) : (
            <button
              type="button"
              className="nav-link"
              disabled={restoring}
              onClick={() => {
                onClose();
                openLogin();
              }}
            >
              <FiLogIn aria-hidden="true" />
              {restoring ? "Checking session…" : "Sign in"}
            </button>
          )}
          <p className="sidebar__user">Saved in this browser</p>
        </div>
      </aside>
    </>
  );
}
