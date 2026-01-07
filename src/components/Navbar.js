// src/components/Navbar.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingBag, FaShoppingCart, FaUserCircle } from "react-icons/fa";

export default function Navbar({ auth, user, cartCount = 0, onProfileClick }) {
  const navigate = useNavigate();
  const [localCartCount, setLocalCartCount] = useState(cartCount);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setLocalCartCount(cartCount);
  }, [cartCount]);

  // Scroll effect for navbar
  useEffect(() => {  
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen for global cartUpdated events
  useEffect(() => {
    const handler = (e) => {
      const detailCount = e?.detail?.count;
      if (typeof detailCount === "number") setLocalCartCount(detailCount);
    };
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  }, []);

  const firstName = user?.name ? user.name.split(" ")[0] : null;
  const firstLetter = firstName?.[0]?.toUpperCase() || "U";
  const isLoggedIn = !!auth?.token;

  return (
    <>
      <style>{`
        .modern-navbar {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          backdrop-filter: blur(10px);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 20px rgba(102, 126, 234, 0.15);
        }

        .modern-navbar.scrolled {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          box-shadow: 0 8px 32px rgba(102, 126, 234, 0.25);
        }

        .brand-logo {
          font-size: 1.5rem;
          font-weight: 700;
          color: white;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;
        }

        .brand-logo:hover {
          transform: translateY(-2px);
          color: #ffd700;
        }

        .brand-icon {
          transition: all 0.3s ease;
        }

        .brand-logo:hover .brand-icon {
          transform: rotate(15deg) scale(1.1);
        }

        .nav-link-modern {
          color: rgba(255, 255, 255, 0.9) !important;
          font-weight: 500;
          padding: 0.5rem 1rem !important;
          border-radius: 8px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .nav-link-modern::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: #ffd700;
          transition: all 0.3s ease;
          transform: translateX(-50%);
        }

        .nav-link-modern:hover {
          color: white !important;
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
        }

        .nav-link-modern:hover::before {
          width: 80%;
        }

        .cart-button {
          position: relative;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 0.6rem 0.8rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }

        .cart-button:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        .cart-icon {
          color: white;
          transition: all 0.3s ease;
        }

        .cart-button:hover .cart-icon {
          transform: scale(1.1);
        }

        .cart-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 0.25rem 0.5rem;
          border-radius: 20px;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        .profile-container {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 25px;
          padding: 0.4rem 1rem 0.4rem 0.4rem;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(10px);
        }

        .profile-container:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .profile-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 1rem;
          color: #667eea;
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
          transition: all 0.3s ease;
        }

        .profile-container:hover .profile-avatar {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 6px 16px rgba(255, 215, 0, 0.5);
        }

        .profile-name {
          color: white;
          font-weight: 600;
          font-size: 0.95rem;
          letter-spacing: 0.3px;
        }

        .login-icon {
          color: white;
          font-size: 2rem;
          transition: all 0.3s ease;
        }

        .profile-container:hover .login-icon {
          transform: scale(1.1);
          color: #ffd700;
        }

        .navbar-toggler {
          border: 2px solid rgba(255, 255, 255, 0.5);
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .navbar-toggler:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: white;
        }

        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(255, 255, 255, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }

        @media (max-width: 991px) {
          .navbar-collapse {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            margin-top: 1rem;
            padding: 1rem;
            border-radius: 12px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          }
        }
      `}</style>

      <nav className={`navbar navbar-expand-lg sticky-top modern-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <Link className="brand-logo" to="/">
            <FaShoppingBag size={32} className="brand-icon" />
            <span>RKShop</span>
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navContent"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link nav-link-modern" to="/">
                  Products
                </Link>
              </li>
              {isLoggedIn && (
                <li className="nav-item">
                  <Link className="nav-link nav-link-modern" to="/orders">
                    My Orders
                  </Link>
                </li>
              )}
              {auth?.isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link nav-link-modern" to="/admin">
                    Admin
                  </Link>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center gap-3">
              {/* Cart button */}
              {isLoggedIn && (
                <div
                  className="cart-button"
                  onClick={() => navigate("/cart")}
                  role="button"
                  aria-label="Open cart"
                  title="Cart"
                >
                  <FaShoppingCart size={20} className="cart-icon" />
                  {localCartCount > 0 && (
                    <span className="cart-badge">
                      {localCartCount}
                    </span>
                  )}
                </div>
              )}

              {/* Profile area */}
              <div
                className="profile-container"
                onClick={() => onProfileClick?.()}
                role="button"
                title={isLoggedIn ? "Profile" : "Login / Signup"}
              >
                {!isLoggedIn ? (
                  <FaUserCircle className="login-icon" />
                ) : (
                  <>
                    <div className="profile-avatar">
                      {firstLetter}
                    </div>
                    <span className="profile-name">{firstName}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}