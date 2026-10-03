import { useId } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiBookOpen } from "react-icons/fi";
import AuthForm from "../../components/auth/AuthForm";
import FlowDecoration from "../../components/ui/FlowDecoration";
import AmbientBackground from "../../components/workspace/AmbientBackground";
export default function AuthEntry() {
  const { mode } = useParams();
  const navigate = useNavigate();
  const id = useId();
  if (!["login", "register"].includes(mode)) return <Navigate to="/" replace />;
  return (
    <main className="workspace-theme auth-page">
      <AmbientBackground variant="auth" />
      <div className="auth-page-top">
        <Link to="/" className="ws-brand">
          <FiBookOpen />
          MyNote.
        </Link>
        <Link to="/" className="ws-text-button">
          <FiArrowLeft />
          Back to home
        </Link>
      </div>
      <div className="auth-page-layout">
        <aside className="auth-story">
          <p className="ws-eyebrow">CAPTURE. ORGANIZE. BREATHE.</p>
          <h2>
            A place to think.
            <br />
            <em>Room to live at your pace.</em>
          </h2>
          <p>
            Small ideas, everyday tasks, and plans still taking shape.
            Everything deserves a place of its own.
          </p>
          <div className="auth-story-note">
            <span>Dear you,</span>
            <h3>
              Just begin.
              <br />
              Take your time.
            </h3>
            <p>One small step is enough to start.</p>
            <span aria-hidden="true">✳</span>
          </div>
          <small>MyNote · At your own pace.</small>
          <FlowDecoration />
        </aside>
        <section className="auth-page-form">
          <AuthForm
            key={mode}
            mode={mode}
            titleId={id}
            onAuthenticated={() => navigate("/create", { replace: true })}
            onSwitch={() =>
              navigate(`/auth/${mode === "login" ? "register" : "login"}`)
            }
          />
        </section>
      </div>
    </main>
  );
}
