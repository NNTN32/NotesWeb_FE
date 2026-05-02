import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuthModal } from "../../context/AuthModalContext";

/**
 * `/auth/login` and `/auth/register`: opens the global auth modal and shows a
 * themed page background behind it (same layout column as other routes).
 */
export default function AuthEntry() {
  const { mode: routeMode } = useParams();
  const { openLogin, openRegister, close } = useAuthModal();

  useEffect(() => {
    if (routeMode === "login") openLogin();
    else if (routeMode === "register") openRegister();

    return () => {
      close();
    };
  }, [routeMode, openLogin, openRegister, close]);

  if (routeMode !== "login" && routeMode !== "register") {
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="auth-pattern-bg relative min-h-[calc(100vh-8rem)] w-full overflow-hidden"
      aria-hidden
    >
      <div className="auth-entry-ambient-orb" />
    </div>
  );
}
