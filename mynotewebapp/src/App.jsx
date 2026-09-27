import { ToastContainer } from "react-toastify";
import AppProviders from "./app/AppProviders";
import AppRoutes from "./app/AppRoutes";
import AuthModal from "./components/auth/AuthModal";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AppProviders>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar
        theme="colored"
      />
      <AuthModal />
    </AppProviders>
  );
}
