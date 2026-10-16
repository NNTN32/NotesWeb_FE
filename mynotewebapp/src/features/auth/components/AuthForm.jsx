import { useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../../../app/routes";
import { useAuthSubmission } from "../useAuthSubmission";
import AuthField from "./AuthField";
import { ENTER } from "../../../lib/motion";
import "../auth.css";
import { formatRetryWait } from "../../../lib/rateLimit.js";

const COPY = {
  login: {
    title: "Sign in",
    submit: "Sign in",
    switchPrompt: "No account yet?",
    switchAction: "Create one",
  },
  register: {
    title: "Create account",
    submit: "Create account",
    switchPrompt: "Already have an account?",
    switchAction: "Sign in",
  },
};

/** Shared by the /auth page and the auth dialog. */
export default function AuthForm({
  mode,
  titleId,
  onSwitch,
  onAuthenticated,
  onContinueAsGuest,
}) {
  const id = useId();
  const root = useRef(null);
  const isRegister = mode === "register";
  const copy = COPY[mode];
  const { submit, pending, error, retryAt, waitSeconds, accountCreated } = useAuthSubmission({
    mode,
    onAuthenticated,
  });

  useEffect(() => {
    // When switching modes inside the dialog, keep focus on the first field.
    if (root.current?.closest("dialog")?.open)
      root.current.querySelector("input")?.focus({ preventScroll: true });
  }, []);

  return (
    <div className={`auth-form ${ENTER.fade}`} ref={root}>
      <h2 id={titleId} className="auth-form__title">
        {copy.title}
      </h2>

      <form
        className="form"
        aria-busy={!!pending}
        aria-describedby={[error && `${id}-error`, retryAt && `${id}-retry`].filter(Boolean).join(" ") || undefined}
        onSubmit={(event) => {
          event.preventDefault();
          submit(Object.fromEntries(new FormData(event.currentTarget)));
        }}
      >
        <fieldset className="auth-form__fields" disabled={!!pending}>
          <AuthField
            id={`${id}-username`}
            name="username"
            label="Username"
            autoComplete="username"
          />
          {isRegister && (
            <AuthField
              id={`${id}-email`}
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
            />
          )}
          <AuthField
            id={`${id}-password`}
            name="password"
            label="Password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
          />
          {isRegister && (
            <AuthField
              id={`${id}-confirm`}
              name="confirmPassword"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
            />
          )}
        </fieldset>

        {error && (
          <p id={`${id}-error`} className="alert" role="alert">
            {error}
          </p>
        )}

        {!!retryAt && (
          <p id={`${id}-retry`} className="alert" role={waitSeconds ? "timer" : "status"} aria-live={waitSeconds ? "off" : "polite"}>
            {waitSeconds ? `Try again in ${formatRetryWait(waitSeconds)}.`
              : accountCreated ? "Switch to Sign in to continue." : "You can try again now."}
          </p>
        )}

        <button
          className="btn btn--primary btn--block"
          type="submit"
          disabled={!!pending || waitSeconds > 0 || accountCreated}
        >
          {pending ? "Please wait…" : waitSeconds ? `Wait ${formatRetryWait(waitSeconds)}`
            : accountCreated ? "Account created" : copy.submit}
        </button>
      </form>

      <p className="sr-only" role="status" aria-atomic="true">
        {pending ? "Connecting to your account…" : ""}
      </p>

      <p className="auth-form__switch muted">
        {copy.switchPrompt}{" "}
        <button
          type="button"
          className="link-btn"
          disabled={!!pending}
          onClick={onSwitch}
        >
          {copy.switchAction}
        </button>
      </p>

      <p className="auth-form__guest muted">
        <Link to={ROUTES.notes} onClick={onContinueAsGuest}>
          Continue without an account
        </Link>
        <br />
        Notes and tasks are stored in this browser.
      </p>
    </div>
  );
}
