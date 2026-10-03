import MotionProvider from "../context/MotionProvider";
import RouteScrollReset from "./RouteScrollReset";
import TasksProvider from "../context/TasksProvider";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthProvider";
import { AuthModalProvider } from "../context/AuthModalProvider";
import { ThemeProvider } from "../context/ThemeProvider";

export default function AppProviders({ children }) {
  return (
    <MotionProvider>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <RouteScrollReset />
            <AuthModalProvider>
              <TasksProvider>{children}</TasksProvider>
            </AuthModalProvider>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </MotionProvider>
  );
}
