import { Link } from "react-router-dom";
import { FiArrowDown, FiHardDrive, FiMoon, FiUnlock } from "react-icons/fi";
import Logo from "../components/ui/Logo";
import ThemeToggle from "../components/ui/ThemeToggle";
import Animate from "../components/ui/Animate";
import Backdrop from "../components/layout/Backdrop";
import FeatureFlow from "../features/home/components/FeatureFlow";
import { useAuth } from "../features/auth/AuthContext";
import { useAuthModal } from "../features/auth/AuthModalContext";
import { ROUTES } from "../app/routes";
import "./home.css";

const FACTS = [
  { icon: FiUnlock, text: "No account needed" },
  { icon: FiHardDrive, text: "Stored in your browser" },
  { icon: FiMoon, text: "Light and dark" },
];

export default function HomePage() {
  const { user } = useAuth();
  const { openLogin } = useAuthModal();

  return (
    <div className="home">
      <Backdrop variant="home" />
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

      <main>
        <section className="home__hero" aria-labelledby="home-title">
          <Animate as="h1" id="home-title" name="rise" index={0}>
            Notes and tasks, in one quiet place.
          </Animate>
          <Animate as="p" name="rise" index={1} className="home__lead">
            Write a thought, turn it into a task, see it in your week.
          </Animate>
          <Animate name="rise" index={2} className="home__actions">
            <Link className="btn btn--primary home__cta" to={ROUTES.notes}>
              Start writing
            </Link>
            <a className="btn btn--ghost" href="#how-it-works">
              See how it works <FiArrowDown aria-hidden="true" />
            </a>
          </Animate>
        </section>

        <Animate name="rise" index={3}>
          <FeatureFlow id="how-it-works" />
        </Animate>

        <section className="home__closing" aria-labelledby="closing-title">
          <h2 id="closing-title">Start with one note.</h2>
          <ul className="home__facts">
            {FACTS.map(({ icon: Icon, text }) => (
              <li key={text}>
                <Icon aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
          <Link className="btn btn--primary home__cta" to={ROUTES.notes}>
            Open Notes
          </Link>
        </section>
      </main>

      <footer className="home__footer muted">
        © {new Date().getFullYear()} MyNote
      </footer>
    </div>
  );
}
