import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import SideMenu from "./components/SideMenu";
import Footer from "./components/Footer";
import LoadingAnimation from "./components/LoadingAnimation";
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NoteDetail from './pages/users/NoteDetail';
import NoteForm from './pages/users/NoteForm';
import Notes from './pages/users/Notes';
import Todo from './pages/users/Todo';
import WeeklyPlan from './pages/users/WeeklyPlan';
import { AuthProvider } from "./context/AuthContext";
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
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex">
          <SideMenu />
          <div className="flex-1 flex flex-col">
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/note/:id" element={<NoteDetail />} />
                <Route path="/create" element={<NoteForm />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/todo" element={<Todo />} />
                <Route path="/weekly-plan" element={<WeeklyPlan />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <ToastContainer position="top-right" autoClose={2000} hideProgressBar theme="colored" />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
