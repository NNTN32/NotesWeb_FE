import { useCallback, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { FaApple } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa6";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useAuthForm } from "../../hooks/useAuthForm";
import FormField from "../../components/FormField";
import { loginUser, loginWithSocialProvider } from "../../utils/api/auth";
import {
  authDividerRevealDelayMs,
  authFieldRevealDelayMs,
  authFooterRevealDelayMs,
  authSocialRevealDelayMs,
  authSubmitRevealDelayMs,
} from "./authFormMotion";

/** Social providers — `id` must match `POST /auth/oauth/:id` */
const SOCIAL_LOGIN_OPTIONS = [
  { id: "google", label: "Google", Icon: FaGoogle, ariaLabel: "Đăng nhập bằng Google" },
  { id: "apple", label: "Apple", Icon: FaApple, ariaLabel: "Đăng nhập bằng Apple" },
];

const LOGIN_FIELDS = [
  { name: "email", type: "email", value: "" },
  { name: "password", type: "password", value: "" },
];

/**
 * @param {Object} props
 * @param {string} [props.idPrefix]
 * @param {string} [props.titleId]
 * @param {() => void} [props.onAuthenticated]
 * @param {() => void} [props.onSwitchToRegister]
 */
export function LoginForm({
  idPrefix = "login",
  titleId = "login-title",
  onAuthenticated,
  onSwitchToRegister,
}) {
  const { login } = useContext(AuthContext) || {};
  const [submitting, setSubmitting] = useState(false);
  const [socialSubmitting, setSocialSubmitting] = useState(null);

  const completeLogin = useCallback(
    (res, fallbackEmail) => {
      if (res?.token) {
        localStorage.setItem("token", res.token);
      }
      const user = res?.user ?? { email: fallbackEmail, name: res?.name ?? fallbackEmail };
      if (login) login(user);
      toast.success("Đăng nhập thành công");
      onAuthenticated?.();
    },
    [login, onAuthenticated]
  );

  const onSubmit = useCallback(
    async (data) => {
      setSubmitting(true);
      try {
        const res = await loginUser({ email: data.email, password: data.password });
        completeLogin(res, data.email);
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Đăng nhập thất bại";
        toast.error(typeof msg === "string" ? msg : "Đăng nhập thất bại");
      } finally {
        setSubmitting(false);
      }
    },
    [completeLogin]
  );

  const handleSocialLogin = useCallback(
    async (providerId) => {
      setSocialSubmitting(providerId);
      try {
        const res = await loginWithSocialProvider(providerId);
        const email = res?.user?.email ?? res?.email ?? "";
        completeLogin(res, email);
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Đăng nhập thất bại";
        toast.error(typeof msg === "string" ? msg : "Đăng nhập thất bại");
      } finally {
        setSocialSubmitting(null);
      }
    },
    [completeLogin]
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
  } = useAuthForm(LOGIN_FIELDS, onSubmit);

  const loginSubmitDelayMs = authSubmitRevealDelayMs(LOGIN_FIELDS.length);
  const loginFooterDelayMs = authFooterRevealDelayMs(LOGIN_FIELDS.length);
  const socialRevealDelayMs = authSocialRevealDelayMs();
  const dividerRevealDelayMs = authDividerRevealDelayMs();
  const authBusy = submitting || Boolean(socialSubmitting);

  return (
    <div className="w-full">
      <h1
        id={titleId}
        className="auth-form-reveal-heading text-2xl font-bold text-ink dark:text-paper sm:text-3xl"
      >
        Đăng nhập
      </h1>
      <p className="auth-form-reveal-subtitle mt-2 text-sm text-coffee/80 dark:text-latte/80">
        Chào mừng bạn quay lại MyNoteWeb3
      </p>

      <div
        className="auth-form-social-reveal mt-8 grid grid-cols-2 gap-3"
        style={{ "--auth-social-delay": `${socialRevealDelayMs}ms` }}
      >
        {SOCIAL_LOGIN_OPTIONS.map((option) => {
          const { Icon } = option;
          const isLoading = socialSubmitting === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={authBusy}
              aria-label={option.ariaLabel}
              onClick={() => handleSocialLogin(option.id)}
              className={`auth-social-btn auth-social-btn--${option.id} disabled:cursor-not-allowed disabled:opacity-60`}
            >
              <Icon className="auth-social-btn-icon" aria-hidden="true" />
              <span>{isLoading ? "Đang xử lý…" : option.label}</span>
            </button>
          );
        })}
      </div>

      <div
        className="auth-form-divider-reveal auth-form-divider"
        style={{ "--auth-divider-delay": `${dividerRevealDelayMs}ms` }}
        role="separator"
        aria-label="hoặc đăng nhập bằng email"
      >
        <span className="auth-form-divider-line" aria-hidden="true" />
        <span className="auth-form-divider-text">hoặc</span>
        <span className="auth-form-divider-line" aria-hidden="true" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {LOGIN_FIELDS.map((field, index) => {
          const Icon = getFieldIcon(field);
          const fid = `${idPrefix}-${field.name}`;
          return (
            <FormField
              key={field.name}
              type={field.type}
              name={field.name}
              value={formData[field.name] ?? ""}
              onChange={handleChange}
              onFocus={() => handleFocus(field.name)}
              onBlur={() => handleBlur(field.name)}
              label={field.name === "email" ? "Email" : "Mật khẩu"}
              placeholder={field.name === "email" ? "you@example.com" : "••••••••"}
              required
              autoComplete={field.name === "email" ? "email" : "current-password"}
              icon={Icon}
              isFocused={fieldFocus[field.name]}
              showPassword={showPasswords[field.name]}
              onTogglePassword={() => handleTogglePassword(field.name)}
              showValidation
              isValid={isFieldValid(field)}
              inputId={fid}
              revealDelayMs={authFieldRevealDelayMs(index)}
            />
          );
        })}

        <button
          type="submit"
          disabled={authBusy}
          className="auth-form-submit-reveal auth-form-submit-btn w-full rounded-full bg-gradient-to-r from-terracotta to-brass py-4 text-lg font-semibold text-white shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          style={{ "--auth-submit-delay": `${loginSubmitDelayMs}ms` }}
        >
          {submitting ? "Đang xử lý…" : "Đăng nhập"}
        </button>
      </form>

      {onSwitchToRegister && (
        <p
          className="auth-form-footer-reveal mt-6 text-center text-sm text-coffee dark:text-latte/90"
          style={{ "--auth-footer-delay": `${loginFooterDelayMs}ms` }}
        >
          Chưa có tài khoản?{" "}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="auth-switch-link font-semibold text-terracotta underline decoration-terracotta/40 underline-offset-2 hover:decoration-terracotta"
          >
            Đăng ký
          </button>
        </p>
      )}
    </div>
  );
}

/**
 * Full-page route: use {@link ./AuthEntry.jsx}. Legacy `/login` redirects here.
 */
export default function Login() {
  return <Navigate to="/auth/login" replace />;
}
