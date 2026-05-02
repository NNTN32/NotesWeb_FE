import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SideMenu from "./components/SideMenu";
import Footer from "./components/Footer";
import LoadingAnimation from "./components/LoadingAnimation";
import Home from './pages/Home';
import AuthEntry from './pages/auth/AuthEntry';
import NoteForm from './pages/users/NoteForm';
import Todo from './pages/users/Todo';
import WeeklyPlan from './pages/users/WeeklyPlan';
import { AuthProvider } from "./context/AuthContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import AuthModal from "./components/auth/AuthModal";
import { ThemeProvider } from "./context/ThemeContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Simulate some initial loading time
  useEffect(() => {
    // You can add actual initialization logic here
    // For now, we'll just use the animation timing
  }, []);

  if (isLoading) {
    return <LoadingAnimation onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
        <AuthModalProvider>
        <div className="min-h-screen flex">
          <SideMenu />
          <div className="flex-1 flex flex-col">
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/:mode" element={<AuthEntry />} />
                <Route path="/login" element={<Navigate to="/auth/login" replace />} />
                <Route path="/register" element={<Navigate to="/auth/register" replace />} />
                <Route path="/create" element={<NoteForm />} />
                <Route path="/todo" element={<Todo />} />
                <Route path="/weekly-plan" element={<WeeklyPlan />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="colored" />
          <AuthModal />
        </div>
        </AuthModalProvider>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
