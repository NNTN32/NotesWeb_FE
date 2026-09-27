import { useId } from "react";
import { FiArrowRight } from "react-icons/fi";
import { FaApple, FaGoogle } from "react-icons/fa";
import { useAuthSubmission } from "../../features/auth/useAuthSubmission";
import AuthField from "./AuthField";
import ChibiMascot from "../ChibiMascot";
import "../../styles/workspace.css";

export default function AuthForm({ mode, titleId, onSwitch, onAuthenticated }) {
  const id = useId();
  const isRegister = mode === "register";
  const { submit, pending, error } = useAuthSubmission({
    mode,
    onAuthenticated,
  });
  return (
    <div className="auth-form-content">
      <div className="auth-mascot">
        <ChibiMascot decorative size={76} />
      </div>
      <p className="ws-eyebrow">MỘT GÓC NHỎ DÀNH CHO BẠN</p>
      <h1 id={titleId}>
        {isRegister ? "Bắt đầu một trang mới." : "Mừng bạn quay lại."}
      </h1>
      <p className="ws-description">
        {isRegister
          ? "Tạo tài khoản MyNote của bạn."
          : "Đăng nhập và tiếp tục câu chuyện của bạn."}
      </p>
      {!isRegister && (
        <>
          <div className="auth-social">
            <button
              type="button"
              disabled={!!pending}
              onClick={() => submit({}, "google")}
            >
              <FaGoogle />
              {pending === "google" ? "Đang kết nối…" : "Google"}
            </button>
            <button
              type="button"
              disabled={!!pending}
              onClick={() => submit({}, "apple")}
            >
              <FaApple />
              {pending === "apple" ? "Đang kết nối…" : "Apple"}
            </button>
          </div>
          <div className="auth-divider">hoặc dùng email</div>
        </>
      )}
      <form
        className="ws-form"
        onSubmit={(event) => {
          event.preventDefault();
          submit(Object.fromEntries(new FormData(event.currentTarget)));
        }}
        aria-describedby={error ? `${id}-error` : undefined}
      >
        <fieldset disabled={!!pending}>
          {isRegister && (
            <AuthField
              id={`${id}-username`}
              name="username"
              label="Tên hiển thị"
              autoComplete="nickname"
              placeholder="Bạn muốn được gọi là gì?"
            />
          )}
          <AuthField
            id={`${id}-email`}
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="ban@example.com"
          />
          <AuthField
            id={`${id}-password`}
            name="password"
            label="Mật khẩu"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder="Nhập mật khẩu của bạn"
          />
          {isRegister && (
            <AuthField
              id={`${id}-confirm`}
              name="confirmPassword"
              label="Xác nhận mật khẩu"
              type="password"
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
            />
          )}
        </fieldset>
        {error && (
          <p id={`${id}-error`} className="ws-error" role="alert">
            {error}
          </p>
        )}
        <button className="ws-button" type="submit" disabled={!!pending}>
          {pending === "email"
            ? "Đang xử lý…"
            : isRegister
              ? "Tạo tài khoản"
              : "Đăng nhập"}
          <FiArrowRight />
        </button>
      </form>
      <p className="auth-switch">
        {isRegister ? "Đã có tài khoản?" : "Chưa có tài khoản?"}{" "}
        <button
          type="button"
          className="ws-text-button"
          disabled={!!pending}
          onClick={onSwitch}
        >
          {isRegister ? "Đăng nhập" : "Đăng ký"}
        </button>
      </p>
      <p className="ws-storage-note auth-local-note">
        Ghi chú và công việc hiện được lưu trên trình duyệt, chưa đồng bộ với
        tài khoản.
      </p>
    </div>
  );
}
