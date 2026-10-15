import { useId } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import Logo from "../components/ui/Logo";
import Animate from "../components/ui/Animate";
import Backdrop from "../components/layout/Backdrop";
import AuthForm from "../features/auth/components/AuthForm";
import { ROUTES } from "../app/routes";
import { usePageTitle } from "../hooks/usePageTitle";

const MODES = ["login", "register"];

export default function AuthPage() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const titleId = useId();
  usePageTitle(mode === "register" ? "Create account" : "Sign in");
  if (!MODES.includes(mode)) return <Navigate to={ROUTES.home} replace />;

  return (
    <main className="auth-page">
      <Backdrop variant="auth" />
      <Animate name="rise" className="auth-page__card">
        <div className="auth-page__logo">
          <Logo />
        </div>
        <AuthForm
          key={mode}
          mode={mode}
          titleId={titleId}
          onAuthenticated={() => navigate(ROUTES.notes, { replace: true })}
          onSwitch={() =>
            navigate(ROUTES.auth(mode === "login" ? "register" : "login"))
          }
        />
      </Animate>
    </main>
  );
}
