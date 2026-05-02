import { useCallback, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { useAuthForm } from "../../hooks/useAuthForm";
import FormField from "../../components/FormField";
import { registerUser } from "../../utils/api/auth";
import {
  authFieldRevealDelayMs,
  authFooterRevealDelayMs,
  authSubmitRevealDelayMs,
} from "./authFormMotion";

const REGISTER_FIELDS = [
  { name: "email", type: "email", value: "" },
  { name: "username", type: "text", value: "" },
  { name: "password", type: "password", value: "" },
  { name: "confirmPassword", type: "password", value: "" },
];

/**
 * @param {Object} props
 * @param {string} [props.idPrefix]
 * @param {string} [props.titleId]
 * @param {() => void} [props.onAuthenticated]
 * @param {() => void} [props.onSwitchToLogin]
 */
export function RegisterForm({
  idPrefix = "register",
  titleId = "register-title",
  onAuthenticated,
  onSwitchToLogin,
}) {
  const { login } = useContext(AuthContext) || {};
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = useCallback(
    async (data) => {
      if (data.password !== data.confirmPassword) {
        toast.error("Mật khẩu xác nhận không khớp");
        return;
      }
      setSubmitting(true);
      try {
        const res = await registerUser({
          email: data.email,
          username: data.username,
          password: data.password,
        });
        if (res?.token) {
          localStorage.setItem("token", res.token);
        }
        const user =
          res?.user ??
          ({
            email: data.email,
            name: data.username,
          });
        if (login) login(user);
        toast.success("Đăng ký thành công");
        onAuthenticated?.();
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          "Đăng ký thất bại";
        toast.error(typeof msg === "string" ? msg : "Đăng ký thất bại");
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
  } = useAuthForm(REGISTER_FIELDS, onSubmit);

  const fieldLabels = {
    email: "Email",
    username: "Tên hiển thị",
    password: "Mật khẩu",
    confirmPassword: "Xác nhận mật khẩu",
  };

  const placeholders = {
    email: "you@example.com",
    username: "Tên của bạn",
    password: "••••••••",
    confirmPassword: "Nhập lại mật khẩu",
  };

  const registerSubmitDelayMs = authSubmitRevealDelayMs(REGISTER_FIELDS.length);
  const registerFooterDelayMs = authFooterRevealDelayMs(REGISTER_FIELDS.length);

  return (
    <div className="w-full">
      <h1
        id={titleId}
        className="auth-form-reveal-heading text-2xl font-bold text-ink dark:text-paper sm:text-3xl"
      >
        Đăng ký
      </h1>
      <p className="auth-form-reveal-subtitle mt-2 text-sm text-coffee/80 dark:text-latte/80">
        Tạo tài khoản để đồng bộ ghi chú của bạn
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
        {REGISTER_FIELDS.map((field, index) => {
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
              label={fieldLabels[field.name]}
              placeholder={placeholders[field.name]}
              required
              autoComplete={
                field.name === "email"
                  ? "email"
                  : field.name === "username"
                    ? "username"
                    : field.name === "password"
                      ? "new-password"
                      : "new-password"
              }
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
          className="auth-form-submit-reveal auth-form-submit-btn w-full rounded-full bg-gradient-to-r from-brass to-terracotta py-4 text-lg font-semibold text-white shadow-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          style={{ "--auth-submit-delay": `${registerSubmitDelayMs}ms` }}
        >
          {submitting ? "Đang xử lý…" : "Đăng ký"}
        </button>
      </form>

      {onSwitchToLogin && (
        <p
          className="auth-form-footer-reveal mt-6 text-center text-sm text-coffee dark:text-latte/90"
          style={{ "--auth-footer-delay": `${registerFooterDelayMs}ms` }}
        >
          Đã có tài khoản?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="auth-switch-link font-semibold text-terracotta underline decoration-terracotta/40 underline-offset-2 hover:decoration-terracotta"
          >
            Đăng nhập
          </button>
        </p>
      )}
    </div>
  );
}

export default function Register() {
  return <Navigate to="/auth/register" replace />;
}
