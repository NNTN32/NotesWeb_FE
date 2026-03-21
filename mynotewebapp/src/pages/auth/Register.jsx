import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserPlus, FaShieldAlt, FaClock } from "react-icons/fa";
import FormField from "../../components/FormField";
import ChibiMascot from "../../components/ChibiMascot";
import AuroraBackground from "../../components/AuroraBackground";
import { useAuthForm } from "../../hooks/useAuthForm";
import { registerUser } from "../../utils/api/auth";

const REGISTER_STEPS = [
  { num: 1, label: "Email", desc: "Để khôi phục tài khoản" },
  { num: 2, label: "Tên đăng nhập", desc: "Định danh của bạn" },
  { num: 3, label: "Mật khẩu", desc: "Bảo vệ tài khoản" },
];

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  const fields = useMemo(
    () => [
      { name: "email", type: "email", label: "Email", placeholder: "Nhập email của bạn", required: true, autoComplete: "email", showValidation: true },
      { name: "username", type: "text", label: "Tên đăng nhập", placeholder: "Nhập tên đăng nhập", required: true, autoComplete: "username", showValidation: true },
      { name: "password", type: "password", label: "Mật khẩu", placeholder: "Tạo mật khẩu mạnh", required: true, autoComplete: "new-password" },
      { name: "confirmPassword", type: "password", label: "Xác nhận mật khẩu", placeholder: "Nhập lại mật khẩu", required: true, autoComplete: "new-password", showValidation: true },
    ],
    []
  );

  const submitForm = useCallback(
    async (data) => {
      setIsLoading(true);
      setError("");
      try {
        if (!data.email || !data.username || !data.password || !data.confirmPassword) {
          throw new Error("Vui lòng điền đầy đủ thông tin");
        }
        if (data.password !== data.confirmPassword) {
          throw new Error("Mật khẩu xác nhận không khớp");
        }
        await registerUser({ email: data.email, username: data.username, password: data.password });
        navigate("/login");
      } catch (err) {
        const res = err?.response?.data;
        const msg = (typeof res === "string" ? res : res?.message) || err?.message || "Đăng ký thất bại";
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
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
    <div className="patterncraft-bg notes-bg min-h-screen relative flex flex-col lg:flex-row">
      <AuroraBackground intensity={0.8} contained />

      {/* Left: Step guide + form - "Provide your information" */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-12 lg:py-16">
        <div className={`w-full max-w-lg ${tx} ${vis}`} style={{ transitionDelay: "0.1s" }}>
          <div className="mb-8">
            <span className="text-sm font-semibold text-rose dark:text-brass">Bắt đầu hành trình</span>
            <h1 className="text-3xl font-bold text-ink dark:text-paper mt-1">Tạo tài khoản</h1>
            <p className="text-coffee dark:text-latte mt-2">
              Chúng tôi cần một vài thông tin để thiết lập tài khoản của bạn
            </p>
          </div>

          {/* Step indicator - info collection focus */}
          <div className="flex gap-4 mb-8 p-4 rounded-xl bg-white/60 dark:bg-ink/30 border border-terracotta/20">
            {REGISTER_STEPS.map((step) => (
              <div key={step.num} className="flex-1 text-center">
                <span className="inline-flex w-8 h-8 items-center justify-center rounded-full bg-gradient-to-r from-rose to-brass text-white text-sm font-bold">
                  {step.num}
                </span>
                <p className="text-xs font-semibold text-ink dark:text-paper mt-2">{step.label}</p>
                <p className="text-[10px] text-coffee dark:text-latte">{step.desc}</p>
              </div>
            ))}
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
              className="w-full py-4 rounded-xl font-bold text-white bg-gradient-to-r from-rose to-brass hover:shadow-lg hover:shadow-rose/25 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <FaUserPlus />
                  Đăng ký
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-coffee dark:text-latte text-sm">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-terracotta font-semibold hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Trust panel + Chibi - "Your info, your control" */}
      <div className="hidden lg:flex relative z-10 w-full lg:w-[420px] flex-shrink-0 flex-col items-center justify-center px-12 py-16 bg-gradient-to-br from-rose/10 via-terracotta/5 to-brass/10 dark:from-rose/20 dark:via-terracotta/10 dark:to-brass/20 border-l border-terracotta/20">
        <div className={`max-w-xs ${tx} ${vis}`} style={{ transitionDelay: "0.2s" }}>
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative mb-6">
              <div className="absolute -inset-4 bg-gradient-to-r from-rose/20 to-brass/20 blur-2xl rounded-full" />
              <ChibiMascot size={140} className="relative drop-shadow-xl" />
            </div>
            <h2 className="text-xl font-bold text-ink dark:text-paper">Thông tin của bạn</h2>
            <p className="text-coffee dark:text-latte text-sm mt-2">
              Chỉ dùng để tạo tài khoản. Chúng tôi bảo vệ dữ liệu của bạn.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/60 dark:bg-ink/30 border border-terracotta/20">
              <FaShieldAlt className="text-terracotta text-xl flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-ink dark:text-paper text-sm">Bảo mật</p>
                <p className="text-xs text-coffee dark:text-latte">Thông tin được mã hóa và lưu trữ an toàn</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/60 dark:bg-ink/30 border border-terracotta/20">
              <FaClock className="text-terracotta text-xl flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="font-semibold text-ink dark:text-paper text-sm">Chỉ vài phút</p>
                <p className="text-xs text-coffee dark:text-latte">Điền 4 trường là xong — đơn giản và nhanh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
