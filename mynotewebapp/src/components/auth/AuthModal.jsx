import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthModal } from "../../context/AuthModalContext";
import { LoginForm } from "../../pages/auth/Login";
import { RegisterForm } from "../../pages/auth/Register";
import ChibiMascot from "../ChibiMascot";

const BACKDROP_OUT_MS = 280;
const PANEL_OUT_MS = 260;

/**
 * Full-viewport overlay with liquid-glass panel and enter/exit motion.
 * Styles: `index.css` — `.liquid-glass-panel`, `.animate-modal-*`, `.animate-auth-liquid`.
 */
export default function AuthModal() {
  const { mode, close, openLogin, openRegister } = useAuthModal();
  const navigate = useNavigate();
  const location = useLocation();
  const titleId = useId();
  const closeRef = useRef(null);

  const [exiting, setExiting] = useState(false);

  const requestClose = useCallback(() => {
    if (exiting) return;
    setExiting(true);
  }, [exiting]);

  const finishClose = useCallback(() => {
    close();
    setExiting(false);
    if (location.pathname.startsWith("/auth")) {
      navigate("/", { replace: true });
    }
  }, [close, location.pathname, navigate]);

  useEffect(() => {
    if (!mode) {
      setExiting(false);
    }
  }, [mode]);

  useEffect(() => {
    if (!mode || exiting) return undefined;

    const onKey = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        requestClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mode, exiting, requestClose]);

  useEffect(() => {
    if (mode && !exiting) {
      const t = window.setTimeout(() => closeRef.current?.focus(), 50);
      return () => window.clearTimeout(t);
    }
    return undefined;
  }, [mode, exiting]);

  useEffect(() => {
    if (!exiting || !mode) return undefined;

    const ms = Math.max(BACKDROP_OUT_MS, PANEL_OUT_MS);
    const t = window.setTimeout(finishClose, ms);
    return () => window.clearTimeout(t);
  }, [exiting, mode, finishClose]);

  if (!mode) return null;

  const backdropClass = exiting
    ? "animate-modal-backdrop-out"
    : "animate-modal-backdrop";
  const panelClass = exiting ? "animate-modal-pop-out" : "animate-modal-pop";

  const node = (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Đóng"
        className={`absolute inset-0 bg-ink/45 dark:bg-black/55 backdrop-blur-[2px] ${backdropClass}`}
        onClick={requestClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`
          liquid-glass-panel relative z-10 w-full max-w-md overflow-y-auto max-h-[min(92dvh,680px)] overflow-x-hidden
          border border-white/35 shadow-2xl dark:border-white/15
          px-6 pb-8 pt-10 sm:px-8 sm:pb-10 sm:pt-12
          animate-auth-liquid ${panelClass}
        `}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-25"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(201, 173, 167, 0.35), transparent 55%), radial-gradient(ellipse 70% 40% at 100% 100%, rgba(162, 123, 92, 0.25), transparent 50%)",
          }}
        />

        <button
          ref={closeRef}
          type="button"
          onClick={requestClose}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full
            border border-coffee/15 bg-white/50 text-ink transition hover:bg-white/80 dark:border-white/10 dark:bg-white/10 dark:text-paper dark:hover:bg-white/20"
          aria-label="Đóng hộp thoại"
        >
          <FaTimes className="text-lg" />
        </button>

        <div key={mode} className="relative z-10">
          <div
            className="auth-modal-mascot-wrap pointer-events-none mb-3 flex shrink-0 justify-center select-none sm:mb-4"
          >
            <ChibiMascot
              decorative
              size={84}
              className="auth-context-chibi [&_.chibi-mascot-svg]:opacity-[0.97]"
            />
          </div>
          {mode === "login" ? (
            <LoginForm
              idPrefix="modal-login"
              titleId={titleId}
              onAuthenticated={requestClose}
              onSwitchToRegister={openRegister}
            />
          ) : (
            <RegisterForm
              idPrefix="modal-register"
              titleId={titleId}
              onAuthenticated={requestClose}
              onSwitchToLogin={openLogin}
            />
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
