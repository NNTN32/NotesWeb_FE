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
      setError("Passwords do not match. Please try again.");
      return;
    }
    if (!provider && mode === "register" && !data.username.trim()) {
      setError("Please enter a display name.");
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
          "The server did not return account details. Please try again.",
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
          : "Could not connect to your account. Please try again later.",
      );
    } finally {
      busy.current = false;
      setPending(null);
    }
  };
  return { submit, pending, error };
}
