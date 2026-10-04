import { useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiLoader, FiHardDrive } from "react-icons/fi";
import { useAuthSubmission } from "../../features/auth/useAuthSubmission";
import AuthField from "./AuthField";
import AntiqueBook from "../ui/AntiqueBook";
import "../../styles/workspace.css";

export default function AuthForm({
  mode,
  titleId,
  onSwitch,
  onAuthenticated,
  onExplore,
}) {
  const id = useId();
  const content = useRef(null);
  useEffect(() => {
    // A newly selected form keeps keyboard focus inside the open dialog.
    if (content.current?.closest("dialog")?.open)
      content.current.querySelector("input")?.focus({ preventScroll: true });
  }, []);
  const isRegister = mode === "register";
  const { submit, pending, error } = useAuthSubmission({
    mode,
    onAuthenticated,
  });
  return (
    <div
      className={`auth-form-content ${isRegister ? "auth-form-content--register" : ""}`}
      ref={content}
    >
      <header className="auth-heading">
        <div className="auth-emblem" aria-hidden="true">
          <AntiqueBook />
        </div>
        <p className="ws-eyebrow">MYNOTE · YOUR LITTLE CORNER</p>
        <h1 id={titleId}>
          {isRegister ? (
            <>
              Start a new <em>page.</em>
            </>
          ) : (
            <>
              Welcome <em>back.</em>
            </>
          )}
        </h1>
        <p className="ws-description">
          {isRegister
            ? "A little space to make your own."
            : "Make yourself at home. Sign in with your username."}
        </p>
      </header>
      <div className="auth-mode-switch" role="group" aria-label="Account mode">
        <button
          type="button"
          aria-pressed={!isRegister}
          disabled={!!pending}
          onClick={() => isRegister && onSwitch()}
        >
          Sign in
        </button>
        <button
          type="button"
          aria-pressed={isRegister}
          disabled={!!pending}
          onClick={() => !isRegister && onSwitch()}
        >
          Sign up
        </button>
      </div>
      <form
        className="ws-form"
        onSubmit={(event) => {
          event.preventDefault();
          submit(Object.fromEntries(new FormData(event.currentTarget)));
        }}
        aria-busy={!!pending}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <fieldset disabled={!!pending}>
          <AuthField
            id={`${id}-username`}
            name="username"
            label="Username"
            autoComplete="username"
            placeholder="Your username"
          />
          {isRegister && (
            <AuthField
              id={`${id}-email`}
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          )}
          <AuthField
            id={`${id}-password`}
            name="password"
            label="Password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder="Your password"
          />
          {isRegister && (
            <AuthField
              id={`${id}-confirm`}
              name="confirmPassword"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat password"
            />
          )}
        </fieldset>
        {error && (
          <p id={`${id}-error`} className="ws-error" role="alert">
            {error}
          </p>
        )}
        <button
          className="ws-button auth-submit"
          type="submit"
          disabled={!!pending}
        >
          {pending === "email"
            ? "Working…"
            : isRegister
              ? "Create account"
              : "Sign in"}
          {pending === "email" ? (
            <FiLoader className="auth-spinner" aria-hidden="true" />
          ) : (
            <FiArrowRight aria-hidden="true" />
          )}
        </button>
      </form>
      <p className="sr-only" role="status" aria-atomic="true">
        {pending ? "Connecting to your account…" : ""}
      </p>
      <div className="auth-footnote">
        <Link to="/create" onClick={onExplore}>
          Begin with a note <FiArrowRight aria-hidden="true" />
        </Link>
        <span>No account needed to start.</span>
      </div>
      <p className="auth-local-note">
        <FiHardDrive aria-hidden="true" />
        <span>
          Notes and tasks stay in this browser. Account sync is not available
          yet.
        </span>
      </p>
    </div>
  );
}
