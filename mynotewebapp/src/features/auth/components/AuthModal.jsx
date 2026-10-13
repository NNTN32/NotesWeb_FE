import { useId } from "react";
import Modal from "../../../components/ui/Modal";
import { useAuthModal } from "../AuthModalContext";
import AuthForm from "./AuthForm";

export default function AuthModal() {
  const { mode, close, openLogin, openRegister } = useAuthModal();
  const titleId = useId();
  if (!mode) return null;
  return (
    <Modal titleId={titleId} onClose={close}>
      <AuthForm
        key={mode}
        mode={mode}
        titleId={titleId}
        onAuthenticated={close}
        onContinueAsGuest={close}
        onSwitch={mode === "login" ? openRegister : openLogin}
      />
    </Modal>
  );
}
