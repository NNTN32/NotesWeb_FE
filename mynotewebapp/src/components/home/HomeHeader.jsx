import BrandLogo from "../ui/BrandLogo";
import MotionToggle from "../motion/MotionToggle";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
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
      <BrandLogo className={styles.brand} />
      <nav
        id="home-navigation"
        aria-label="Home navigation"
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
        <MotionToggle className={styles.iconButton} />
        <button
          type="button"
          className={styles.iconButton}
          onClick={toggleTheme}
          aria-label={
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
          }
        >
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>
        {user ? (
          <Link className={styles.headerLogin} to="/create">
            Open your space <FiArrowUpRight />
          </Link>
        ) : (
          <button
            type="button"
            className={styles.headerLogin}
            onClick={openLogin}
          >
            Sign in <FiArrowUpRight />
          </button>
        )}
        <button
          id="home-menu-toggle"
          type="button"
          className={`${styles.iconButton} ${styles.menuToggle}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="home-navigation"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  );
}
