import "./App.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProductList from "./pages/ProductList";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders"; 
import AuthModal from "./components/AuthModal";
import AdminDashboard from "./pages/AdminDashboard"; 
import AdminUsers from "./pages/AdminUsers";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";

export default function App() {
  // boolean auth (true when token exists)
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return token && user
      ? { token, isAdmin: JSON.parse(user).isAdmin }
      : { token: null, isAdmin: false };
  });

  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem("user");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  // wrapper so we can run cleanup when logging out
  const updateAuth = (value) => {
    if (!value) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
      setCartCount(0);
      setAuth({ token: null, isAdmin: false });
    } else {
      setAuth(value);
    }
  };

  // fetch logged-in user's profile (if token present)
  const fetchMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setAuth({ token: null, isAdmin: false });
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/api/auth/getuser", {
        method: "POST",
        headers: { "auth-token": token },
      });
      if (!res.ok) {
        // invalid token: clear
        setUser(null);
        setAuth({ token: null, isAdmin: false });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        return;
      }
      const data = await res.json();
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
      setAuth({ token, isAdmin: data.isAdmin });
    } catch (err) {
      console.error("fetchMe error:", err);
      setUser(null);
      setAuth({ token: null, isAdmin: false });
    }
  };

  // try to fetch user when app mounts if token exists
  useEffect(() => {
    if (localStorage.getItem("token") && !user) {
      fetchMe();
    }
    // sync cross-tab changes
    const onStorage = (e) => {
      if (e.key === "token") {
        if (e.newValue) {
          const user = JSON.parse(localStorage.getItem("user"));
          setAuth({
            token: e.newValue,
            isAdmin: user?.isAdmin || false,
          });
        } else {
          setAuth({ token: null, isAdmin: false });
          setUser(null);
        }
      }
      if (e.key === "user") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showAlert = (msg, type = "success") => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  const isLoggedIn = !!auth?.token;

  return (
    <BrowserRouter>
      <Navbar
        auth={auth}
        updateAuth={updateAuth}
        user={user}
        setUser={setUser}
        cartCount={cartCount}
        onProfileClick={() => setShowAuthModal(true)}
      />

      {/* Alert Component with highest z-index */}
      {alert && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 99999,
            width: "90%",
            maxWidth: "500px",
            animation: "slideDown 0.3s ease-out",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderRadius: "12px",
              backgroundColor:
                alert.type === "success"
                  ? "#d1fae5"
                  : alert.type === "error"
                  ? "#fee2e2"
                  : alert.type === "warning"
                  ? "#fef3c7"
                  : "#dbeafe",
              color:
                alert.type === "success"
                  ? "#065f46"
                  : alert.type === "error"
                  ? "#991b1b"
                  : alert.type === "warning"
                  ? "#92400e"
                  : "#1e40af",
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              fontWeight: "500",
              fontSize: "15px",
              lineHeight: "1.5",
              border: `2px solid ${
                alert.type === "success"
                  ? "#6ee7b7"
                  : alert.type === "error"
                  ? "#fca5a5"
                  : alert.type === "warning"
                  ? "#fcd34d"
                  : "#93c5fd"
              }`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Icon based on type */}
              <span style={{ fontSize: "20px", flexShrink: 0 }}>
                {alert.type === "success"
                  ? "✅"
                  : alert.type === "error"
                  ? "❌"
                  : alert.type === "warning"
                  ? "⚠️"
                  : "ℹ️"}
              </span>
              <span>{alert.msg}</span>
            </div>
            <button
              onClick={() => setAlert(null)}
              style={{
                background: 
                  alert.type === "success"
                    ? "#6ee7b7"
                    : alert.type === "error"
                    ? "#fca5a5"
                    : alert.type === "warning"
                    ? "#fcd34d"
                    : "#93c5fd",
                border: "none",
                borderRadius: "6px",
                color:
                  alert.type === "success"
                    ? "#065f46"
                    : alert.type === "error"
                    ? "#991b1b"
                    : alert.type === "warning"
                    ? "#92400e"
                    : "#1e40af",
                cursor: "pointer",
                padding: "4px 8px",
                marginLeft: "12px",
                fontSize: "18px",
                lineHeight: "1",
                flexShrink: 0,
                transition: "all 0.2s ease",
                fontWeight: "bold",
              }}
              onMouseEnter={(e) => {
                e.target.style.opacity = "0.8";
              }}
              onMouseLeave={(e) => {
                e.target.style.opacity = "1";
              }}
              aria-label="Close alert"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <Routes>
        <Route
          path="/"
          element={
            <ProductList
              auth={auth}
              showAlert={showAlert}
              openAuthModal={() => setShowAuthModal(true)}
            />
          }
        />
        <Route
          path="/cart"
          element={
            isLoggedIn ? <Cart showAlert={showAlert} /> : <Navigate to="/" />
          }
        />
        <Route
          path="/orders"
          element={isLoggedIn ? <Orders /> : <Navigate to="/" />}
        />
        <Route
          path="/admin"
          element={
            auth?.token && auth?.isAdmin ? (
              <AdminDashboard auth={auth} user={user} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/admin" element={<AdminDashboard auth={auth} />} />
        <Route path="/admin/users" element={<AdminUsers auth={auth} />} />
        <Route path="/admin/orders" element={<AdminOrders auth={auth} />} />
        <Route path="/admin/products" element={<AdminProducts auth={auth} />} />
        <Route
          path="*"
          element={<div className="container mt-4">Not Found</div>}
        />
      </Routes>

      {showAuthModal && (
        <AuthModal
          show={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          auth={auth}
          updateAuth={updateAuth}
          user={user}
          setUser={(u) => {
            setUser(u);
            if (u) localStorage.setItem("user", JSON.stringify(u));
            else localStorage.removeItem("user");
          }}
          showAlert={showAlert}
        />
      )}
    </BrowserRouter>
  );
}