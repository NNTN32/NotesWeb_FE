import { lazy, Suspense, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowDown, FiHardDrive, FiMoon, FiUnlock } from "react-icons/fi";
import Logo from "../components/ui/Logo";
import ThemeToggle from "../components/ui/ThemeToggle";
import Animate from "../components/ui/Animate";
import Backdrop from "../components/layout/Backdrop";
import Reveal from "../components/ui/Reveal";
import QuickStart from "../features/home/components/QuickStart";
import { usePageTitle } from "../hooks/usePageTitle";
import { useTasks } from "../features/tasks/TasksContext";
import { useAuth } from "../features/auth/AuthContext";
import { useAuthModal } from "../features/auth/AuthModalContext";
import { ROUTES } from "../app/routes";
import "./home.css";

// Below-the-fold sections load after the hero is interactive.
const FeatureFlow = lazy(
  () => import("../features/home/components/FeatureFlow"),
);
const LayoutShowcase = lazy(
  () => import("../features/home/components/LayoutShowcase"),
);

const HOW_IT_WORKS = "how-it-works";

const FACTS = [
  { icon: FiUnlock, text: "No account needed" },
  { icon: FiHardDrive, text: "Stored in your browser" },
  { icon: FiMoon, text: "Light and dark" },
];

export default function HomePage() {
  const { user } = useAuth();
  const { openLogin } = useAuthModal();
  // Anyone with saved tasks has used MyNote before: greet them, skip the pitch.
  // Decided once per visit so the headline never changes under a new user.
  const { tasks } = useTasks();
  const [returning] = useState(() => tasks.length > 0);
  usePageTitle();

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
            {returning
              ? "Welcome back."
              : "Notes and tasks, in one quiet place."}
          </Animate>
          <Animate as="p" name="rise" index={1} className="home__lead">
            {returning
              ? "Pick up where you left off."
              : "Write a thought, turn it into a task, see it in your week."}
          </Animate>
          <Animate name="rise" index={2}>
            <QuickStart />
          </Animate>
          <Animate name="rise" index={3} className="home__actions">
            <Link className="btn btn--ghost" to={ROUTES.notes}>
              Start writing a note
            </Link>
            <a
              className="btn btn--ghost"
              href={`#${HOW_IT_WORKS}`}
              onClick={() =>
                // Move keyboard focus with the scroll, so Tab continues there.
                document
                  .getElementById(HOW_IT_WORKS)
                  ?.focus({ preventScroll: true })
              }
            >
              See how it works <FiArrowDown aria-hidden="true" />
            </a>
          </Animate>
        </section>

        {/* Sections below the hero rise in once as they scroll into view. */}
        <Suspense fallback={null}>
          <Reveal>
            <FeatureFlow id={HOW_IT_WORKS} />
          </Reveal>

          <Reveal>
            <LayoutShowcase />
          </Reveal>
        </Suspense>

        <Reveal
          as="section"
          className="home__closing"
          aria-labelledby="closing-title"
        >
          <h2 id="closing-title">
            {returning
              ? "Your notes are a click away."
              : "Start with one note."}
          </h2>
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
        </Reveal>
      </main>

      <footer className="home__footer muted">
        © {new Date().getFullYear()} MyNote
      </footer>
    </div>
  );
}
