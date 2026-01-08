import React, { useState } from "react";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUserPlus, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function SignUp({ setAuth, showAlert }) {
  const [cred, setCred] = useState({ name: "", email: "", password: "", cpassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const API_BASE = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cred.password !== cred.cpassword) {
      showAlert && showAlert("Passwords do not match!", "danger");
      return; 
    }
    setIsLoading(true);
    
    try {
      const res = await fetch(`${API_BASE}/api/auth/createuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: cred.name, 
          email: cred.email, 
          password: cred.password 
        }),
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setAuth(true);
        showAlert && showAlert("Account Created Successfully", "success");
        console.log("Navigating to home...");
      } else {
        showAlert && showAlert(data.error || "Signup failed", "danger");
      }
    } catch (err) {
      console.error(err);
      showAlert && showAlert("Signup failed", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const onChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };

  const isPasswordMatch = cred.cpassword === "" || cred.password === cred.cpassword;
  const passwordStrength = cred.password.length === 0 ? null : 
    cred.password.length < 5 ? 'weak' :
    cred.password.length < 8 ? 'medium' : 'strong';

  return (
    <>
      <style>{`
        .signup-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }

        .signup-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          max-width: 520px;
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

        .signup-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2.5rem 2rem;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .signup-header::before {
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

        .signup-icon-wrapper {
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

        .signup-icon {
          color: white;
          font-size: 2.5rem;
        }

        .signup-title {
          color: white;
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          position: relative;
          z-index: 1;
          letter-spacing: 0.5px;
        }

        .signup-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.95rem;
          margin-top: 0.5rem;
          position: relative;
          z-index: 1;
        }

        .signup-body {
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

        .input-field.error {
          border-color: #fc8181;
          background: #fff5f5;
        }

        .input-field.success {
          border-color: #68d391;
          background: #f0fff4;
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

        .password-strength {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .strength-bar {
          height: 4px;
          flex: 1;
          background: #e2e8f0;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .strength-bar.active.weak {
          background: #fc8181;
        }

        .strength-bar.active.medium {
          background: #f6ad55;
        }

        .strength-bar.active.strong {
          background: #68d391;
        }

        .password-match-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .password-match-indicator.match {
          color: #48bb78;
        }

        .password-match-indicator.no-match {
          color: #f56565;
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

        .login-link {
          text-align: center;
          color: #4a5568;
          font-size: 0.95rem;
        }

        .login-link-text {
          color: #667eea;
          font-weight: 600;
          text-decoration: none;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .login-link-text:hover {
          color: #764ba2;
          text-decoration: underline;
        }

        @media (max-width: 576px) {
          .signup-header {
            padding: 2rem 1.5rem;
          }

          .signup-body {
            padding: 2rem 1.5rem;
          }

          .signup-title {
            font-size: 1.75rem;
          }
        }
      `}</style>

      <div className="signup-container">
        <div className="signup-card">
          <div className="signup-header">
            <div className="signup-icon-wrapper">
              <FaUserPlus className="signup-icon" />
            </div>
            <h2 className="signup-title">Create Account</h2>
            <p className="signup-subtitle">Join MyShop today and start shopping</p>
          </div>

          <div className="signup-body">
            <div>
              {/* Name Field */}
              <div 
                className={`input-group-modern ${focusedField === 'name' ? 'focused' : ''}`}
              >
                <label className="input-label">Full Name</label>
                <div className="input-wrapper">
                  <FaUser className="input-icon" size={18} />
                  <input
                    name="name"
                    type="text"
                    className="input-field"
                    value={cred.name}
                    onChange={onChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
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
                    value={cred.email}
                    onChange={onChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    required
                    autoComplete="username"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Field */}
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
                    value={cred.password}
                    onChange={onChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    minLength={5}
                    required
                    autoComplete="new-password"
                    placeholder="Create a password"
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
                {passwordStrength && (
                  <div className="password-strength">
                    <div className={`strength-bar ${passwordStrength === 'weak' || passwordStrength === 'medium' || passwordStrength === 'strong' ? 'active' : ''} ${passwordStrength}`}></div>
                    <div className={`strength-bar ${passwordStrength === 'medium' || passwordStrength === 'strong' ? 'active' : ''} ${passwordStrength}`}></div>
                    <div className={`strength-bar ${passwordStrength === 'strong' ? 'active' : ''} ${passwordStrength}`}></div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div 
                className={`input-group-modern ${focusedField === 'cpassword' ? 'focused' : ''}`}
              >
                <label className="input-label">Confirm Password</label>
                <div className="input-wrapper">
                  <FaLock className="input-icon" size={18} />
                  <input
                    name="cpassword"
                    type={showCPassword ? "text" : "password"}
                    className={`input-field ${cred.cpassword && !isPasswordMatch ? 'error' : ''} ${cred.cpassword && isPasswordMatch ? 'success' : ''}`}
                    value={cred.cpassword}
                    onChange={onChange}
                    onFocus={() => setFocusedField('cpassword')}
                    onBlur={() => setFocusedField(null)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmit(e);
                      }
                    }}
                    minLength={5}
                    required
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    style={{ paddingRight: '3rem' }}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowCPassword(!showCPassword)}
                    aria-label={showCPassword ? "Hide password" : "Show password"}
                  >
                    {showCPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {cred.cpassword && (
                  <div className={`password-match-indicator ${isPasswordMatch ? 'match' : 'no-match'}`}>
                    {isPasswordMatch ? (
                      <>
                        <FaCheckCircle size={16} />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle size={16} />
                        <span>Passwords do not match</span>
                      </>
                    )}
                  </div>
                )}
              </div>

              <button
                type="button"
                className="submit-button"
                disabled={isLoading || !isPasswordMatch}
                onClick={handleSubmit}
              >
                {isLoading ? (
                  <>
                    <div className="spinner" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <FaUserPlus size={20} />
                    <span>Create Account</span>
                  </>
                )}
              </button>
            </div>

            <div className="divider">
              <span>OR</span>
            </div>

            <div className="login-link">
              Already have an account? <span className="login-link-text">Login</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}