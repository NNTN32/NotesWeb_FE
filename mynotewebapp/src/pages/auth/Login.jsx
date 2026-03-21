import { useState, useContext, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaRegStickyNote, FaTasks, FaCalendarAlt } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import FormField from "../../components/FormField";
import ChibiMascot from "../../components/ChibiMascot";
import AuroraBackground from "../../components/AuroraBackground";
import { useAuthForm } from "../../hooks/useAuthForm";

const JOURNEY_FEATURES = [
  { icon: FaRegStickyNote, label: "Ghi chú", desc: "Ý tưởng của bạn đang chờ", to: "/create" },
  { icon: FaTasks, label: "Todo", desc: "Tiếp tục công việc", to: "/todo" },
  { icon: FaCalendarAlt, label: "Weekly Plan", desc: "Kế hoạch tuần của bạn", to: "/weekly-plan" },
];

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const fields = useMemo(
    () => [
      { name: "username", type: "text", label: "Tên đăng nhập", placeholder: "Nhập tên đăng nhập", required: true, autoComplete: "username", showValidation: true },
      { name: "password", type: "password", label: "Mật khẩu", placeholder: "Nhập mật khẩu", required: true, autoComplete: "current-password" },
    ],
    []
  );

  const submitForm = useCallback(
    async (data) => {
      setIsLoading(true);
      setError("");
      try {
        if (!data.username || !data.password) {
          throw new Error("Vui lòng điền đầy đủ thông tin");
        }
        await new Promise((r) => setTimeout(r, 1000));
        login({ id: 1, username: data.username, name: "User" });
        navigate("/");
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    },
    [login, navigate]
  );

  const {
    formData,
    fieldFocus,
    showPasswords,
    handleChange,
    handleFocus,
    handleBlur,
    handleTogglePassword,
    handleSubmit,
    getFieldIcon,
    isFieldValid,
  } = useAuthForm(fields, submitForm);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const tx = "transition-all duration-500 ease-out";
  const vis = visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6";

  return (
    <div className="patterncraft-bg notes-bg min-h-screen relative flex">
      <AuroraBackground intensity={0.8} contained />

      {/* Left: Compact login form - "Quick return" */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12 lg:py-0">
        <div className={`w-full max-w-sm ${tx} ${vis}`} style={{ transitionDelay: "0.1s" }}>
          <div className="mb-8">
            <span className="text-sm font-semibold text-terracotta dark:text-brass">Quay trở lại</span>
            <h1 className="text-3xl font-bold text-ink dark:text-paper mt-1">Đăng nhập</h1>
            <p className="text-coffee dark:text-latte mt-2">
              Điền thông tin để tiếp tục hành trình của bạn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm animate-shake">
                {error}
              </div>
            )}
            {fields.map((f) => (
              <FormField
                key={f.name}
                {...f}
                value={formData[f.name] ?? ""}
                onChange={handleChange}
                onFocus={() => handleFocus(f.name)}
                onBlur={() => handleBlur(f.name)}
                icon={getFieldIcon(f)}
                isFocused={fieldFocus[f.name]}
                showPassword={showPasswords[f.name]}
                onTogglePassword={() => handleTogglePassword(f.name)}
                showValidation={f.showValidation}
                isValid={isFieldValid(f)}
              />
            ))}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-coffee to-terracotta hover:shadow-lg hover:shadow-terracotta/25 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <FaSignInAlt />
                  Đăng nhập
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-coffee dark:text-latte text-sm">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-terracotta font-semibold hover:underline">
              Đăng ký ngay
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Journey panel - "What awaits you" */}
      <div className="hidden lg:flex relative z-10 flex-1 items-center justify-center px-12 py-16 bg-gradient-to-br from-coffee/10 via-terracotta/5 to-rose/10 dark:from-coffee/20 dark:via-terracotta/10 dark:to-rose/20 border-l border-terracotta/20">
        <div className={`max-w-md ${tx} ${vis}`} style={{ transitionDelay: "0.2s" }}>
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-coffee/20 to-terracotta/20 blur-2xl rounded-full" />
              <ChibiMascot size={140} className="relative drop-shadow-xl" />
            </div>
            <h2 className="text-2xl font-bold text-ink dark:text-paper">Chào mừng trở lại</h2>
            <p className="text-coffee dark:text-latte mt-2">
              Ghi chú, todo và kế hoạch của bạn đang chờ bạn
            </p>
          </div>

          <p className="text-sm font-semibold text-ink dark:text-paper mb-4">Tiếp tục với</p>
          <div className="space-y-3">
            {JOURNEY_FEATURES.map((item, i) => {
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  to={item.to}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/70 dark:bg-ink/40 border border-terracotta/20 hover:border-terracotta/40 hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br from-coffee to-terracotta text-white group-hover:scale-105 transition-transform">
                    <Icon className="text-xl" />
                  </div>
                  <div className="text-left flex-1">
                    <span className="font-bold text-ink dark:text-paper block">{item.label}</span>
                    <span className="text-sm text-coffee dark:text-latte">{item.desc}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
