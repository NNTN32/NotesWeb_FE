import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiMenu,
  FiMoon,
  FiSun,
  FiX,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useAuthModal } from "../../context/AuthModalContext";
import { useTheme } from "../../context/ThemeContext";
import { HOME_LINKS } from "../../pages/home/homeConstants";
import styles from "../../pages/home/Home.module.css";

export default function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const { openLogin } = useAuthModal();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.brand} aria-label="MyNote — Trang chủ">
        <FiBookOpen aria-hidden="true" /> MyNote
        <span className={styles.brandDot}>.</span>
      </Link>
      <nav
        id="home-navigation"
        aria-label="Điều hướng trang chủ"
        className={`${styles.navigation} ${menuOpen ? styles.navigationOpen : ""}`}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setMenuOpen(false);
            document.getElementById("home-menu-toggle")?.focus();
          }
        }}
      >
        {HOME_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className={styles.headerActions}>
        <button
          type="button"
          className={styles.iconButton}
          onClick={toggleTheme}
          aria-label={
            theme === "light" ? "Bật giao diện tối" : "Bật giao diện sáng"
          }
        >
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>
        {user ? (
          <Link className={styles.headerLogin} to="/create">
            Vào không gian <FiArrowUpRight />
          </Link>
        ) : (
          <button
            type="button"
            className={styles.headerLogin}
            onClick={openLogin}
          >
            Đăng nhập <FiArrowUpRight />
          </button>
        )}
        <button
          id="home-menu-toggle"
          type="button"
          className={`${styles.iconButton} ${styles.menuToggle}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="home-navigation"
          aria-label={menuOpen ? "Đóng điều hướng" : "Mở điều hướng"}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
}
