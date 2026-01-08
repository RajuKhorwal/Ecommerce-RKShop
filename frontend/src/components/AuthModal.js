import React, { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaSignInAlt, FaUserPlus, FaCheckCircle, FaTimesCircle, FaSignOutAlt } from "react-icons/fa";

export default function AuthModal({
  show,
  mode = "login",
  onClose,
  user,
  setUser,
  auth,
  updateAuth,
  showAlert,
}) {
  const [active, setActive] = useState(mode);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const API_BASE = process.env.REACT_APP_BACKEND_URL;

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    cpassword: "",
  });

  useEffect(() => {
    if (show) {
      if (auth?.token) setActive("profile");
      else setActive(mode);
    }
  }, [show, mode, auth]);

  const fetchMe = async () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const res = await fetch(`${API_BASE}/api/auth/getuser`, {
        method: "POST",
        headers: { "auth-token": token },
      });
      if (!res.ok) return null;
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("fetchMe error:", err);
      return null;
    }
  };

  const closeModal = () => {
    if (!loading) onClose?.();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.token) {
        throw new Error(data.error || "Login failed");
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setUser(data.user);
      updateAuth({ token: data.token, isAdmin: data.user.isAdmin });
      showAlert && showAlert("Logged in successfully", "success");
      closeModal();
      window.dispatchEvent(
        new CustomEvent("cartUpdated", { detail: { count: 0 } })
      );
    } catch (err) {
      showAlert && showAlert(err.message || "Login failed", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (signupForm.password !== signupForm.cpassword) {
      showAlert && showAlert("Passwords do not match", "danger");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/createuser`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signupForm.name,
          email: signupForm.email,
          password: signupForm.password,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.token) {
        throw new Error(data.error || "Signup failed");
      }
      localStorage.setItem("token", data.token);
      const me = await fetchMe();
      if (!me) throw new Error("Failed to fetch user details");
      setUser(me);
      localStorage.setItem("user", JSON.stringify(me));
      updateAuth({ token: data.token, isAdmin: me.isAdmin });
      showAlert && showAlert("Account created", "success");
      closeModal();
      window.dispatchEvent(
        new CustomEvent("cartUpdated", { detail: { count: 0 } })
      );
    } catch (err) {
      showAlert && showAlert(err.message || "Signup failed", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    updateAuth(null);
    showAlert && showAlert("Logged out", "success");
    closeModal();
    window.dispatchEvent(
      new CustomEvent("cartUpdated", { detail: { count: 0 } })
    );
  };

  const isPasswordMatch = signupForm.cpassword === "" || signupForm.password === signupForm.cpassword;
  const passwordStrength = signupForm.password.length === 0 ? null : 
    signupForm.password.length < 5 ? 'weak' :
    signupForm.password.length < 8 ? 'medium' : 'strong';

  if (!show) return null;

  return (
    <>
      <style>{`
        .auth-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1040;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .auth-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          animation: fadeIn 0.3s ease;
        }

        .auth-modal-dialog {
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          max-width: 500px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .auth-modal-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .auth-modal-header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: ripple 15s infinite;
        }

        @keyframes ripple {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 30px); }
        }

        .auth-modal-title {
          color: white;
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0;
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .auth-modal-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 2;
          color: white;
          font-size: 1.25rem;
        }

        .auth-modal-close:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }

        .auth-modal-body {
          padding: 2rem;
          max-height: calc(90vh - 120px);
          overflow-y: auto;
        }

        .input-group-modal {
          position: relative;
          margin-bottom: 1.25rem;
        }

        .input-label-modal {
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          display: block;
          transition: all 0.3s ease;
        }

        .input-wrapper-modal {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon-modal {
          position: absolute;
          left: 1rem;
          color: #a0aec0;
          transition: all 0.3s ease;
          z-index: 1;
          pointer-events: none;
        }

        .input-field-modal {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          background: #f7fafc;
        }

        .input-field-modal.error {
          border-color: #fc8181;
          background: #fff5f5;
        }

        .input-field-modal.success {
          border-color: #68d391;
          background: #f0fff4;
        }

        .input-field-modal:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .input-group-modal.focused .input-icon-modal {
          color: #667eea;
          transform: scale(1.1);
        }

        .input-group-modal.focused .input-label-modal {
          color: #667eea;
        }

        .password-toggle-modal {
          position: absolute;
          right: 0.75rem;
          background: none;
          border: none;
          color: #a0aec0;
          cursor: pointer;
          padding: 0.5rem;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .password-toggle-modal:hover {
          color: #667eea;
          transform: scale(1.1);
        }

        .password-strength {
          display: flex;
          gap: 0.4rem;
          margin-top: 0.5rem;
        }

        .strength-bar {
          height: 3px;
          flex: 1;
          background: #e2e8f0;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .strength-bar.active.weak { background: #fc8181; }
        .strength-bar.active.medium { background: #f6ad55; }
        .strength-bar.active.strong { background: #68d391; }

        .password-match-indicator {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.5rem;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .password-match-indicator.match { color: #48bb78; }
        .password-match-indicator.no-match { color: #f56565; }

        .submit-button-modal {
          width: 100%;
          padding: 0.875rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }

        .submit-button-modal::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }

        .submit-button-modal:hover::before { left: 100%; }

        .submit-button-modal:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .submit-button-modal:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner-modal {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .switch-text {
          text-align: center;
          margin-top: 1.25rem;
          color: #718096;
          font-size: 0.9rem;
        }

        .switch-link {
          color: #667eea;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .switch-link:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        .profile-avatar-large {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 2rem;
          color: white;
          margin: 0 auto 1.5rem;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          transition: all 0.3s ease;
        }

        .profile-avatar-large:hover {
          transform: scale(1.05);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.4);
        }

        .profile-name {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .profile-email {
          text-align: center;
          color: #718096;
          margin-bottom: 2rem;
        }

        .profile-info-card {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .profile-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .profile-info-row:last-child {
          border-bottom: none;
        }

        .profile-info-label {
          color: #718096;
          font-size: 0.9rem;
        }

        .profile-info-value {
          color: #2d3748;
          font-weight: 600;
          font-size: 0.95rem;
        }

        .logout-button {
          width: 100%;
          padding: 0.875rem;
          background: white;
          color: #e53e3e;
          border: 2px solid #e53e3e;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .logout-button:hover {
          background: #e53e3e;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(229, 62, 62, 0.3);
        }

        @media (max-width: 576px) {
          .auth-modal-body {
            padding: 1.5rem;
          }
        }
      `}</style>

      <div className="auth-modal-backdrop" onClick={closeModal} />
      <div className="auth-modal">
        <div className="auth-modal-dialog">
          <div className="auth-modal-header">
            <h2 className="auth-modal-title">
              {active === "login" && "Welcome Back"}
              {active === "signup" && "Create Account"}
              {active === "profile" && "Your Profile"}
            </h2>
            <button
              className="auth-modal-close"
              onClick={closeModal}
              disabled={loading}
            >
              ×
            </button>
          </div>

          <div className="auth-modal-body">
            {active === "login" && (
              <div>
                <div className={`input-group-modal ${focusedField === 'login-email' ? 'focused' : ''}`}>
                  <label className="input-label-modal">Email Address</label>
                  <div className="input-wrapper-modal">
                    <FaEnvelope className="input-icon-modal" size={16} />
                    <input
                      type="email"
                      className="input-field-modal"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      onFocus={() => setFocusedField('login-email')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="username"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className={`input-group-modal ${focusedField === 'login-password' ? 'focused' : ''}`}>
                  <label className="input-label-modal">Password</label>
                  <div className="input-wrapper-modal">
                    <FaLock className="input-icon-modal" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input-field-modal"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      onFocus={() => setFocusedField('login-password')}
                      onBlur={() => setFocusedField(null)}
                      onKeyPress={(e) => { if (e.key === 'Enter') handleLogin(e); }}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      style={{ paddingRight: '2.75rem' }}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-modal"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  className="submit-button-modal"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-modal" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <FaSignInAlt size={18} />
                      <span>Login</span>
                    </>
                  )}
                </button>

                <div className="switch-text">
                  Don't have an account?{" "}
                  <span className="switch-link" onClick={() => !loading && setActive("signup")}>
                    Create one
                  </span>
                </div>
              </div>
            )}

            {active === "signup" && (
              <div>
                <div className={`input-group-modal ${focusedField === 'signup-name' ? 'focused' : ''}`}>
                  <label className="input-label-modal">Full Name</label>
                  <div className="input-wrapper-modal">
                    <FaUser className="input-icon-modal" size={16} />
                    <input
                      type="text"
                      className="input-field-modal"
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      onFocus={() => setFocusedField('signup-name')}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className={`input-group-modal ${focusedField === 'signup-email' ? 'focused' : ''}`}>
                  <label className="input-label-modal">Email Address</label>
                  <div className="input-wrapper-modal">
                    <FaEnvelope className="input-icon-modal" size={16} />
                    <input
                      type="email"
                      className="input-field-modal"
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      onFocus={() => setFocusedField('signup-email')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="username"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className={`input-group-modal ${focusedField === 'signup-password' ? 'focused' : ''}`}>
                  <label className="input-label-modal">Password</label>
                  <div className="input-wrapper-modal">
                    <FaLock className="input-icon-modal" size={16} />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="input-field-modal"
                      value={signupForm.password}
                      onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                      onFocus={() => setFocusedField('signup-password')}
                      onBlur={() => setFocusedField(null)}
                      autoComplete="new-password"
                      placeholder="Create a password"
                      style={{ paddingRight: '2.75rem' }}
                      minLength={5}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-modal"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  {passwordStrength && (
                    <div className="password-strength">
                      <div className={`strength-bar ${passwordStrength === 'weak' || passwordStrength === 'medium' || passwordStrength === 'strong' ? 'active' : ''} ${passwordStrength}`}></div>
                      <div className={`strength-bar ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'active' : ''} ${passwordStrength}`}></div>
                      <div className={`strength-bar ${passwordStrength === 'strong' ? 'active' : ''} ${passwordStrength}`}></div>
                    </div>
                  )}
                </div>

                <div className={`input-group-modal ${focusedField === 'signup-cpassword' ? 'focused' : ''}`}>
                  <label className="input-label-modal">Confirm Password</label>
                  <div className="input-wrapper-modal">
                    <FaLock className="input-icon-modal" size={16} />
                    <input
                      type={showCPassword ? "text" : "password"}
                      className={`input-field-modal ${signupForm.cpassword && !isPasswordMatch ? 'error' : ''} ${signupForm.cpassword && isPasswordMatch ? 'success' : ''}`}
                      value={signupForm.cpassword}
                      onChange={(e) => setSignupForm({ ...signupForm, cpassword: e.target.value })}
                      onFocus={() => setFocusedField('signup-cpassword')}
                      onBlur={() => setFocusedField(null)}
                      onKeyPress={(e) => { if (e.key === 'Enter') handleSignup(e); }}
                      autoComplete="new-password"
                      placeholder="Confirm your password"
                      style={{ paddingRight: '2.75rem' }}
                      minLength={5}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-modal"
                      onClick={() => setShowCPassword(!showCPassword)}
                    >
                      {showCPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                  </div>
                  {signupForm.cpassword && (
                    <div className={`password-match-indicator ${isPasswordMatch ? 'match' : 'no-match'}`}>
                      {isPasswordMatch ? (
                        <>
                          <FaCheckCircle size={14} />
                          <span>Passwords match</span>
                        </>
                      ) : (
                        <>
                          <FaTimesCircle size={14} />
                          <span>Passwords do not match</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                <button
                  className="submit-button-modal"
                  onClick={handleSignup}
                  disabled={loading || !isPasswordMatch}
                >
                  {loading ? (
                    <>
                      <div className="spinner-modal" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <FaUserPlus size={18} />
                      <span>Create Account</span>
                    </>
                  )}
                </button>

                <div className="switch-text">
                  Already have an account?{" "}
                  <span className="switch-link" onClick={() => !loading && setActive("login")}>
                    Login
                  </span>
                </div>
              </div>
            )}

            {active === "profile" && (
              <div>
                <div className="profile-avatar-large">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className="profile-name">{user?.name}</div>
                <div className="profile-email">{user?.email}</div>

                <div className="profile-info-card">
                  <div className="profile-info-row">
                    <span className="profile-info-label">Full Name</span>
                    <span className="profile-info-value">{user?.name}</span>
                  </div>
                  <div className="profile-info-row">
                    <span className="profile-info-label">Email</span>
                    <span className="profile-info-value">{user?.email}</span>
                  </div>
                </div>

                <button
                  className="logout-button"
                  onClick={handleLogout}
                  disabled={loading}
                >
                  <FaSignOutAlt size={18} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}