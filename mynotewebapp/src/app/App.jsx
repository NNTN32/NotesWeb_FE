import { ToastContainer } from "react-toastify";
import AppProviders from "./AppProviders";
import AppRoutes from "./AppRoutes";
import AuthModal from "../features/auth/components/AuthModal";

export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
      <AuthModal />
      <ToastContainer
        position="bottom-right"
        autoClose={4000}
        hideProgressBar
        closeButton={false}
      />
    </AppProviders>
  );
}
