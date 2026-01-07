import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSignInAlt } from "react-icons/fa";

export default function Login({ setAuth, showAlert }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const API_BASE = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: credentials.email, 
          password: credentials.password 
        }),
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setAuth(true);
        showAlert && showAlert("Successfully Logged In", "success");
        console.log("Navigating to home...");
      } else {
        showAlert && showAlert(data.error || "Invalid credentials", "danger");
      }
    } catch (err) {
      console.error(err);
      showAlert && showAlert("Login failed", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
      <style>{`
        .login-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        .login-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          max-width: 480px;
          width: 100%;
          animation: slideUp 0.5s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .login-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2.5rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        } 

        .login-header::before {
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
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(30px, 30px);
          }
        }

        .login-icon-wrapper {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          backdrop-filter: blur(10px);
          border: 3px solid rgba(255, 255, 255, 0.3);
          position: relative;
          z-index: 1;
        }

        .login-icon {
          color: white;
          font-size: 2.5rem;
        }

        .login-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          position: relative;
          z-index: 1;
          letter-spacing: 0.5px;
        }

        .login-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.95rem;
          margin-top: 0.5rem;
          position: relative;
          z-index: 1;
        }

        .login-body {
          padding: 2.5rem 2rem;
        }

        .input-group-modern {
          position: relative;
          margin-bottom: 1.5rem;
        }

        .input-label {
          font-weight: 600;
          color: #4a5568;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          display: block;
          transition: all 0.3s ease;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          color: #a0aec0;
          transition: all 0.3s ease;
          z-index: 1;
          pointer-events: none;
        }

        .input-field {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 3rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f7fafc;
        }

        .input-field:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
        }

        .input-group-modern.focused .input-icon {
          color: #667eea;
          transform: scale(1.1);
        }

        .input-group-modern.focused .input-label {
          color: #667eea;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: #a0aec0;
          cursor: pointer;
          padding: 0.5rem;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .password-toggle:hover {
          color: #667eea;
          transform: scale(1.1);
        }

        .submit-button {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 2rem;
        }

        .submit-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }

        .submit-button:hover::before {
          left: 100%;
        }

        .submit-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
        }

        .submit-button:active {
          transform: translateY(0);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .forgot-password {
          text-align: center;
          margin-top: 1.5rem;
        }

        .forgot-password-link {
          color: #667eea;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .forgot-password-link:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        .divider {
          display: flex;
          align-items: center;
          margin: 1.5rem 0;
          color: #a0aec0;
          font-size: 0.875rem;
        }

        .divider::before,
        .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #e2e8f0;
        }

        .divider span {
          padding: 0 1rem;
        }

        .signup-link {
          text-align: center;
          color: #4a5568;
          font-size: 0.95rem;
        }

        .signup-link-text {
          color: #667eea;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .signup-link-text:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        @media (max-width: 576px) {
          .login-header {
            padding: 2rem 1.5rem;
          }

          .login-body {
            padding: 2rem 1.5rem;
          }

          .login-title {
            font-size: 1.75rem;
          }
        }
      `}</style>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="login-icon-wrapper">
              <FaSignInAlt className="login-icon" />
            </div>
            <h2 className="login-title">Welcome Back</h2>
            <p className="login-subtitle">Login to continue to MyShop</p>
          </div>

          <div className="login-body">
            <div onSubmit={handleSubmit}>
              <div 
                className={`input-group-modern ${focusedField === 'email' ? 'focused' : ''}`}
              >
                <label className="input-label">Email Address</label>
                <div className="input-wrapper">
                  <FaEnvelope className="input-icon" size={18} />
                  <input
                    name="email"
                    type="email"
                    className="input-field"
                    value={credentials.email}
                    onChange={onChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="username"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div 
                className={`input-group-modern ${focusedField === 'password' ? 'focused' : ''}`}
              >
                <label className="input-label">Password</label>
                <div className="input-wrapper">
                  <FaLock className="input-icon" size={18} />
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="input-field"
                    value={credentials.password}
                    onChange={onChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(e);
                      }
                    }}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    style={{ paddingRight: '3rem' }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="forgot-password">
                <span className="forgot-password-link">Forgot Password?</span>
              </div>

              <button
                type="button"
                className="submit-button"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <>
                    <FaSignInAlt size={20} />
                    <span>Login</span>
                  </>
                )}
              </button>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="signup-link">
              Don't have an account? <span className="signup-link-text">Sign Up</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}