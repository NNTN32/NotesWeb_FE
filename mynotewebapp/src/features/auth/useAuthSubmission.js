import { useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  loginUser,
  registerUser,
  loginWithSocialProvider,
} from "../../utils/api/auth";

export function useAuthSubmission({ mode, onAuthenticated }) {
  const { login } = useAuth();
  const [pending, setPending] = useState(null);
  const [error, setError] = useState("");
  const busy = useRef(false);
  const submit = async (data, provider) => {
    if (busy.current) return;
    setError("");
    if (
      !provider &&
      mode === "register" &&
      data.password !== data.confirmPassword
    ) {
      setError("Mật khẩu xác nhận chưa khớp. Bạn kiểm tra lại nhé.");
      return;
    }
    if (!provider && mode === "register" && !data.username.trim()) {
      setError("Vui lòng nhập tên hiển thị.");
      return;
    }
    busy.current = true;
    setPending(provider || "email");
    try {
      const response = provider
        ? await loginWithSocialProvider(provider)
        : mode === "register"
          ? await registerUser({
              email: data.email.trim(),
              username: data.username.trim(),
              password: data.password,
            })
          : await loginUser({
              email: data.email.trim(),
              password: data.password,
            });
      if (!response?.token && !response?.user)
        throw new Error(
          "Máy chủ chưa trả về thông tin tài khoản. Vui lòng thử lại.",
        );
      if (response.token) localStorage.setItem("token", response.token);
      login(
        response.user || {
          email: data.email,
          name: data.username || data.email,
        },
      );
      onAuthenticated?.();
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error;
      setError(
        typeof message === "string"
          ? message
          : "Chưa thể kết nối tài khoản. Vui lòng thử lại sau.",
      );
    } finally {
      busy.current = false;
      setPending(null);
    }
  };
  return { submit, pending, error };
}
