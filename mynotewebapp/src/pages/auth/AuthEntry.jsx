import { useId } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft, FiBookOpen } from "react-icons/fi";
import AuthForm from "../../components/auth/AuthForm";
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
          Về trang chủ
        </Link>
      </div>
      <div className="auth-page-layout">
        <aside className="auth-story">
          <p className="ws-eyebrow">GHI LẠI. SẮP XẾP. THẢNH THƠI.</p>
          <h2>
            Một nơi để nghĩ.
            <br />
            <em>Một nhịp để sống.</em>
          </h2>
          <p>
            Những ý tưởng nhỏ, những việc cần làm và cả kế hoạch còn dang dở.
            Mọi thứ đều xứng đáng có một góc riêng.
          </p>
          <div className="auth-story-note">
            <span>Gửi bạn,</span>
            <h3>
              Cứ bắt đầu.
              <br />
              Chậm cũng được.
            </h3>
            <p>Chỉ cần bắt đầu từ một điều nhỏ thôi.</p>
            <span aria-hidden="true">✳</span>
          </div>
          <small>MyNote · Theo nhịp của bạn.</small>
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
