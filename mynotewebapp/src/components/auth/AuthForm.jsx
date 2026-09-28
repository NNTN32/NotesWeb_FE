import { useId } from "react";
import { FiArrowRight } from "react-icons/fi";
import { FaApple, FaGoogle } from "react-icons/fa";
import { useAuthSubmission } from "../../features/auth/useAuthSubmission";
import AuthField from "./AuthField";
import ChibiMascot from "../ChibiMascot";
import "../../styles/workspace.css";

export default function AuthForm({ mode, titleId, onSwitch, onAuthenticated }) {
  const id = useId();
  const isRegister = mode === "register";
  const { submit, pending, error } = useAuthSubmission({
    mode,
    onAuthenticated,
  });
  return (
    <div className="auth-form-content">
      <div className="auth-mascot">
        <ChibiMascot decorative size={76} />
      </div>
      <p className="ws-eyebrow">A LITTLE SPACE FOR YOU</p>
      <h1 id={titleId}>{isRegister ? "Start a new page." : "Welcome back."}</h1>
      <p className="ws-description">
        {isRegister
          ? "Create your MyNote account."
          : "Sign in and pick up where you left off."}
      </p>
      {!isRegister && (
        <>
          <div className="auth-social">
            <button
              type="button"
              disabled={!!pending}
              onClick={() => submit({}, "google")}
            >
              <FaGoogle />
              {pending === "google" ? "Connecting…" : "Google"}
            </button>
            <button
              type="button"
              disabled={!!pending}
              onClick={() => submit({}, "apple")}
            >
              <FaApple />
              {pending === "apple" ? "Connecting…" : "Apple"}
            </button>
          </div>
          <div className="auth-divider">or use email</div>
        </>
      )}
      <form
        className="ws-form"
        onSubmit={(event) => {
          event.preventDefault();
          submit(Object.fromEntries(new FormData(event.currentTarget)));
        }}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <fieldset disabled={!!pending}>
          {isRegister && (
            <AuthField
              id={`${id}-username`}
              name="username"
              label="Display name"
              autoComplete="nickname"
              placeholder="What should we call you?"
            />
          )}
          <AuthField
            id={`${id}-email`}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
          />
          <AuthField
            id={`${id}-password`}
            name="password"
            label="Password"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder="Enter your password"
          />
          {isRegister && (
            <AuthField
              id={`${id}-confirm`}
              name="confirmPassword"
              label="Confirm password"
              type="password"
              autoComplete="new-password"
              placeholder="Enter your password again"
            />
          )}
        </fieldset>
        {error && (
          <p id={`${id}-error`} className="ws-error" role="alert">
            {error}
          </p>
        )}
        <button className="ws-button" type="submit" disabled={!!pending}>
          {pending === "email"
            ? "Working…"
            : isRegister
              ? "Create account"
              : "Sign in"}
          <FiArrowRight />
        </button>
      </form>
      <p className="auth-switch">
        {isRegister ? "Already have an account?" : "New to MyNote?"}{" "}
        <button
          type="button"
          className="ws-text-button"
          disabled={!!pending}
          onClick={onSwitch}
        >
          {isRegister ? "Sign in" : "Sign up"}
        </button>
      </p>
      <p className="ws-storage-note auth-local-note">
        Notes and tasks are currently stored in this browser and do not sync
        with your account.
      </p>
    </div>
  );
}
