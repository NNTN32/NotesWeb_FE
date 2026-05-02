import { useCallback, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useAuthForm } from "../../hooks/useAuthForm";
import FormField from "../../components/FormField";
import { loginUser } from "../../utils/api/auth";
import {
  authFieldRevealDelayMs,
  authFooterRevealDelayMs,
  authSubmitRevealDelayMs,
} from "./authFormMotion";

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

  const onSubmit = useCallback(
    async (data) => {
      setSubmitting(true);
      try {
        const res = await loginUser({ email: data.email, password: data.password });
        if (res?.token) {
          localStorage.setItem("token", res.token);
        }
        const user = res?.user ?? { email: data.email, name: res?.name ?? data.email };
        if (login) login(user);
        toast.success("Đăng nhập thành công");
        onAuthenticated?.();
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
    [login, onAuthenticated]
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

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
        noValidate
      >
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
          disabled={submitting}
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
