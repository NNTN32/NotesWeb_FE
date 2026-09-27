import { NavLink, Link } from "react-router-dom";
import {
  FiBookOpen,
  FiEdit3,
  FiCheckSquare,
  FiCalendar,
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
const NAVIGATION = [
  { to: "/create", label: "Sổ ghi chép", icon: FiEdit3 },
  { to: "/todo", label: "Việc hôm nay", icon: FiCheckSquare },
  { to: "/weekly-plan", label: "Kế hoạch tuần", icon: FiCalendar },
];
export default function SideMenu({ mobileOpen, onClose }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { openLogin } = useAuthModal();
  return (
    <>
      {mobileOpen && (
        <button
          className="ws-sidebar-backdrop"
          aria-label="Đóng điều hướng"
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
            aria-label="Đóng menu"
          >
            <FiX />
          </button>
        </div>
        <p className="ws-nav-label">KHÔNG GIAN CỦA BẠN</p>
        <nav aria-label="Không gian làm việc">
          {NAVIGATION.map((item) => {
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
            Về trang chủ
          </Link>
        </nav>
        <div className="ws-sidebar-note">
          <span>✳</span>
          <p>
            Mỗi ngày một chút.
            <br />
            Theo nhịp của bạn.
          </p>
        </div>
        <div className="ws-sidebar-bottom">
          <button className="ws-nav-link" onClick={toggleTheme}>
            {theme === "light" ? <FiMoon /> : <FiSun />}
            {theme === "light" ? "Giao diện tối" : "Giao diện sáng"}
          </button>
          {user ? (
            <>
              <p className="ws-user">
                <FiUser />
                {user.name || user.username || user.email}
              </p>
              <button className="ws-nav-link" onClick={logout}>
                <FiLogOut />
                Đăng xuất
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
              Đăng nhập
            </button>
          )}
          <span className="ws-storage-note">
            Ghi chú & công việc lưu cục bộ
          </span>
        </div>
      </aside>
    </>
  );
}
