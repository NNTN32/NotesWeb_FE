import { NavLink, Link } from "react-router-dom";
import {
  FiBookOpen,
  FiHome,
  FiMoon,
  FiSun,
  FiLogOut,
  FiUser,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useAuthModal } from "../context/AuthModalContext";
import { WORKSPACE_NAVIGATION } from "../app/navigation";
export default function SideMenu({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { openLogin } = useAuthModal();
  return (
    <>
      {mobileOpen && (
        <button
          className="ws-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={onClose}
        />
      )}
      <aside
        id="workspace-navigation"
        className={`ws-sidebar ${mobileOpen ? "ws-sidebar--open" : ""}`}
      >
        <div className="ws-sidebar-brand">
          <Link className="ws-brand" to="/" onClick={onClose}>
            <FiBookOpen />
            MyNote<span>.</span>
          </Link>
          <button
            className="ws-icon-button ws-mobile-only"
            onClick={onClose}
            aria-label="Close menu"
          >
            <FiX />
          </button>
        </div>
        <p className="ws-nav-label">YOUR SPACE</p>
        <nav aria-label="Workspace">
          {WORKSPACE_NAVIGATION.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `ws-nav-link ${isActive ? "ws-nav-link--active" : ""}`
                }
              >
                <Icon />
                {item.label}
              </NavLink>
            );
          })}
          <Link to="/" className="ws-nav-link ws-nav-home" onClick={onClose}>
            <FiHome />
            Back to home
          </Link>
        </nav>
        <div className="ws-sidebar-note">
          <span>✳</span>
          <p>
            A little each day.
            <br />
            At your own pace.
          </p>
        </div>
        <div className="ws-sidebar-bottom">
          <button className="ws-nav-link" onClick={toggleTheme}>
            {theme === "light" ? <FiMoon /> : <FiSun />}
            {theme === "light" ? "Dark mode" : "Light mode"}
          </button>
          {user ? (
            <>
              <p className="ws-user">
                <FiUser />
                {user.name || user.username || user.email}
              </p>
              <button className="ws-nav-link" onClick={logout}>
                <FiLogOut />
                Sign out
              </button>
            </>
          ) : (
            <button
              className="ws-nav-link"
              onClick={() => {
                onClose();
                openLogin();
              }}
            >
              <FiUser />
              Sign in
            </button>
          )}
          <span className="ws-storage-note">Notes & tasks saved locally</span>
        </div>
      </aside>
    </>
  );
}
