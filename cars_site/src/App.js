import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EditProfile from "./pages/EditProfile";
import Contact from "./pages/Contact";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound"; // Import NotFound
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Checkout from "./components/Checkout";
import Orders from "./components/Orders";
import Toast from "./components/Toast";

const BASE_URL = "http://localhost:5000";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "", show: false });
  const navigate = useNavigate();
  const location = useLocation();

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, show: true });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/check-auth`, {
      method: "GET",
      credentials: "include"
    })
      .then(response => {
        if (!response.ok) throw new Error("Auth check failed");
        return response.json();
      })
      .then(data => {
        if (data.isLoggedIn) {
          setUser(data.user);
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setUser(null);
      });
  }, []);

  const handleLogin = useCallback((userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    showToast("Login successful", "success");
    navigate("/");
  }, [navigate, showToast]);

  const handleLogout = useCallback(() => {
    setIsLoggingOut(true);
    fetch(`${BASE_URL}/api/logout`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" }
    })
      .then(response => {
        if (!response.ok) throw new Error("Logout failed");
        return response.json();
      })
      .then(() => {
        setUser(null);
        setIsLoggedIn(false);
        showToast("Logged out successfully", "success");
        navigate("/login");
      })
      .catch(() => {
        setUser(null);
        setIsLoggedIn(false);
        showToast("Logout failed", "error");
        navigate("/");
      })
      .finally(() => {
        setIsLoggingOut(false);
      });
  }, [navigate, showToast]);

  return (
    <div className="min-h-screen flex flex-col">
      {isLoggingOut && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {toast.show && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] w-full max-w-xs">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        </div>
      )}
      <Navbar 
        isLoggedIn={isLoggedIn} 
        user={user} 
        showToast={showToast}
        onLogout={handleLogout} 
      />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} user={user} />} />
          <Route path="/login" element={<Login onLogin={handleLogin} navigateTo={navigate} showToast={showToast} />} />
          <Route path="/register" element={<Register navigateTo={navigate} showToast={showToast} />} />
          <Route path="/profile" element={<EditProfile user={user} setUser={setUser} isLoggedIn={isLoggedIn} />} />
          <Route path="/contact" element={<Contact isLoggedIn={isLoggedIn} />} />
          <Route path="/admin" element={<AdminDashboard user={user} showToast={showToast} />} />
          <Route path="/checkout" element={<Checkout showToast={showToast} />} />
          <Route path="/orders" element={<Orders isLoggedIn={isLoggedIn} showToast={showToast} />} />
          <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 */}
        </Routes>
      </main>
      <FooterWrapper />
    </div>
  );
}

function FooterWrapper() {
  const location = useLocation();
  const hideFooter = location.pathname === '/login' || location.pathname === '/register';
  return !hideFooter ? <Footer /> : null;
}

export default App;