import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthProvider";
import { AuthModalProvider } from "../context/AuthModalProvider";
import { ThemeProvider } from "../context/ThemeProvider";

export default function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AuthModalProvider>{children}</AuthModalProvider>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
