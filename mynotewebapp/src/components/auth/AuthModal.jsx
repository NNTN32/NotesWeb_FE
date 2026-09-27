import { useId } from "react";
import { useAuthModal } from "../../context/AuthModalContext";
import Modal from "../workspace/Modal";
import AuthForm from "./AuthForm";
export default function AuthModal() {
  const { mode, close, openLogin, openRegister } = useAuthModal();
  const id = useId();
  if (!mode) return null;
  return (
    <Modal titleId={id} onClose={close} className="auth-dialog">
      <AuthForm
        key={mode}
        mode={mode}
        titleId={id}
        onAuthenticated={close}
        onSwitch={mode === "login" ? openRegister : openLogin}
      />
    </Modal>
  );
}
