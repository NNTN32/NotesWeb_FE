import { Link } from "react-router-dom";
import { FiCalendar, FiCheckSquare, FiEdit3 } from "react-icons/fi";
import Logo from "../components/ui/Logo";
import ThemeToggle from "../components/ui/ThemeToggle";
import { useAuth } from "../features/auth/AuthContext";
import { useAuthModal } from "../features/auth/AuthModalContext";
import { ROUTES } from "../app/routes";
import "./home.css";

const FEATURES = [
  {
    icon: FiEdit3,
    title: "Notes",
    text: "Write freely. Every change is saved as you type.",
    to: ROUTES.notes,
  },
  {
    icon: FiCheckSquare,
    title: "Today",
    text: "Add a task, press Enter, check it off.",
    to: `${ROUTES.tasks}?view=day`,
  },
  {
    icon: FiCalendar,
    title: "This week",
    text: "See all seven days and move at your own pace.",
    to: `${ROUTES.tasks}?view=week`,
  },
];

export default function HomePage() {
  const { user } = useAuth();
  const { openLogin } = useAuthModal();

  return (
    <div className="home">
      <header className="home__header">
        <Logo />
        <div className="home__header-actions">
          <ThemeToggle />
          {user ? (
            <Link className="btn" to={ROUTES.notes}>
              Open app
            </Link>
          ) : (
            <button type="button" className="btn" onClick={openLogin}>
              Sign in
            </button>
          )}
        </div>
      </header>

      <main className="home__hero">
        <h1>Notes and tasks, in one quiet place.</h1>
        <p className="home__lead">
          Capture ideas, plan your day and see your week. No account needed to
          start.
        </p>
        <Link className="btn btn--primary home__cta" to={ROUTES.notes}>
          Start writing
        </Link>

        <ul className="home__features">
          {FEATURES.map(({ icon: Icon, title, text, to }) => (
            <li key={title}>
              <Link to={to} className="home__feature">
                <Icon aria-hidden="true" />
                <strong>{title}</strong>
                <span>{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>

      <footer className="home__footer muted">
        Your notes and tasks are stored in this browser. © {new Date().getFullYear()} MyNote
      </footer>
    </div>
  );
}
