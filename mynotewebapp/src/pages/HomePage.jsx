import { Link } from "react-router-dom";
import { FiCalendar, FiCheckSquare, FiEdit3 } from "react-icons/fi";
import Logo from "../components/ui/Logo";
import ThemeToggle from "../components/ui/ThemeToggle";
import Animate from "../components/ui/Animate";
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
        <Animate as="h1" name="rise" index={0}>
          Notes and tasks, in one quiet place.
        </Animate>
        <Animate as="p" name="rise" index={1} className="home__lead">
          Capture ideas, plan your day and see your week. No account needed to
          start.
        </Animate>
        <Animate name="rise" index={2}>
          <Link className="btn btn--primary home__cta" to={ROUTES.notes}>
            Start writing
          </Link>
        </Animate>

        <ul className="home__features">
          {FEATURES.map(({ icon: Icon, title, text, to }, index) => (
            <Animate as="li" key={title} name="rise" index={index + 3}>
              <Link to={to} className="home__feature">
                <Icon aria-hidden="true" />
                <strong>{title}</strong>
                <span>{text}</span>
              </Link>
            </Animate>
          ))}
        </ul>
      </main>

      <footer className="home__footer muted">
        Your notes and tasks are stored in this browser. ©{" "}
        {new Date().getFullYear()} MyNote
      </footer>
    </div>
  );
}
