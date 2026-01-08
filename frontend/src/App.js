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
    const token = localStorage.getItem("token"); // 1
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
      setAuth({ token: null, isAdmin: false }); // 2
    } else {
      setAuth(value);
    }
  };

  // fetch logged-in user's profile (if token present)
  const fetchMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setAuth({ token: null, isAdmin: false }); // 3
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
        setAuth({ token: null, isAdmin: false }); // 4
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
    setTimeout(() => setAlert(null), 1500);
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

      {alert && (
        <div style={{ position: "fixed", top: 10, right: 10, zIndex: 1000 }}>
          <div className={`alert-container alert-${alert.type} mb-0`}>{alert.msg}</div>
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
