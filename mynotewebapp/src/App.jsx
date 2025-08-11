import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideMenu from "./components/SideMenu";
import Footer from "./components/Footer";
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NoteDetail from './pages/NoteDetail';
import NoteForm from './pages/NoteForm';
import Notes from './pages/Notes';
import Todo from './pages/Todo';
import AI from './pages/AI';
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
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
                <Route path="/ai" element={<AI />} />
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
