import React from "react";
import { FaUsers, FaBox, FaShoppingBag, FaChartLine, FaCrown, FaArrowRight, FaLock } from "react-icons/fa";

export default function AdminDashboard({ auth }) {
  // This will work with react-router-dom's useNavigate in your actual app
  const handleNavigate = (path) => {
    // In your actual app, replace this with: navigate(path)
    // For now, this simulates navigation
    window.location.href = path;
  };

  if (!auth?.isAdmin) {
    return (
      <>
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
          }
        `}</style>
        <div style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '24px',
            padding: '3rem 2rem',
            textAlign: 'center',
            maxWidth: '500px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            animation: 'shake 0.5s ease-in-out'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
            }}>
              <FaLock size={50} color="white" />
            </div>
            <h3 style={{
              color: '#2d3748',
              fontSize: '1.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              Access Denied
            </h3>
            <p style={{
              color: '#718096',
              fontSize: '1rem',
              marginBottom: '2rem'
            }}>
              You don't have permission to access the admin dashboard.
            </p>
            <button
              onClick={() => handleNavigate('/')}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '0.875rem 2rem',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
              }}
            >
              Go to Home
            </button>
          </div>
        </div>
      </>
    );
  }

  const adminCards = [
    {
      title: "Users",
      icon: FaUsers,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      description: "Manage user accounts",
      path: "/admin/users",
      stats: "View all users",
    },
    {
      title: "Orders",
      icon: FaBox,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      description: "Track and manage orders",
      path: "/admin/orders",
      stats: "View all orders",
    },
    {
      title: "Products",
      icon: FaShoppingBag,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      description: "Add and manage products",
      path: "/admin/products",
      stats: "Manage inventory",
    },
  ];

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .admin-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }

        .admin-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 24px;
          padding: 3rem 2rem;
          margin-bottom: 3rem;
          box-shadow: 0 20px 60px rgba(102, 126, 234, 0.3);
          position: relative;
          overflow: hidden;
          animation: fadeIn 0.6s ease-out;
        }

        .admin-header::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: float 6s ease-in-out infinite;
        }

        .admin-title-section {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          position: relative;
          z-index: 1;
        }

        .admin-crown-icon {
          animation: float 3s ease-in-out infinite;
        }

        .admin-title {
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          margin: 0;
          text-align: center;
        }

        .admin-subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          text-align: center;
          margin-top: 0.5rem;
          position: relative;
          z-index: 1;
        }

        .admin-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .admin-card {
          background: white;
          border-radius: 20px;
          padding: 0;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          animation: fadeIn 0.6s ease-out;
          position: relative;
        }

        .admin-card:nth-child(1) { animation-delay: 0.1s; }
        .admin-card:nth-child(2) { animation-delay: 0.2s; }
        .admin-card:nth-child(3) { animation-delay: 0.3s; }

        .admin-card:hover {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.2);
        }

        .admin-card-gradient {
          height: 140px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .admin-card-gradient::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          transition: left 0.5s ease;
        }

        .admin-card:hover .admin-card-gradient::before {
          left: 100%;
        }

        .admin-card-icon-wrapper {
          width: 80px;
          height: 80px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
        }

        .admin-card:hover .admin-card-icon-wrapper {
          transform: scale(1.15) rotate(5deg);
        }

        .admin-card-body {
          padding: 2rem;
        }

        .admin-card-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .admin-card-description {
          color: #718096;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }

        .admin-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 1rem;
          border-top: 2px solid #f7fafc;
        }

        .admin-card-stats {
          color: #4a5568;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .admin-card-arrow {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: all 0.3s ease;
        }

        .admin-card:hover .admin-card-arrow {
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .stats-banner {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 3rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          display: flex;
          justify-content: space-around;
          align-items: center;
          flex-wrap: wrap;
          gap: 2rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-icon {
          color: #667eea;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #718096;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          color: #2d3748;
          font-size: 1.75rem;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .admin-title {
            font-size: 2rem;
          }

          .admin-cards-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .stats-banner {
            flex-direction: column;
            gap: 1.5rem;
          }
        }
      `}</style>

      <div className="admin-container">
        <div className="container">
          <div className="admin-header">
            <div className="admin-title-section">
              <FaCrown size={50} color="#ffd700" className="admin-crown-icon" />
              <h1 className="admin-title">Admin Dashboard</h1>
            </div>
            <p className="admin-subtitle">
              Manage your e-commerce platform from here
            </p>
          </div>

          <div className="stats-banner">
            <div className="stat-item">
              <div className="stat-icon">
                <FaChartLine size={32} />
              </div>
              <div className="stat-label">Total Sales</div>
              <div className="stat-value">₹0</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FaUsers size={32} />
              </div>
              <div className="stat-label">Active Users</div>
              <div className="stat-value">0</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FaBox size={32} />
              </div>
              <div className="stat-label">Orders</div>
              <div className="stat-value">0</div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FaShoppingBag size={32} />
              </div>
              <div className="stat-label">Products</div>
              <div className="stat-value">0</div>
            </div>
          </div>

          <div className="admin-cards-grid">
            {adminCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div 
                  key={index}
                  className="admin-card"
                  onClick={() => handleNavigate(card.path)}
                >
                  <div
                    className="admin-card-gradient"
                    style={{ background: card.gradient }}
                  > 
                    <div className="admin-card-icon-wrapper">
                      <Icon size={40} color="white" />
                    </div>
                  </div>
                  <div className="admin-card-body">
                    <h3 className="admin-card-title">{card.title}</h3>
                    <p className="admin-card-description">
                      {card.description}
                    </p>
                    <div className="admin-card-footer">
                      <span className="admin-card-stats">{card.stats}</span>
                      <div className="admin-card-arrow">
                        <FaArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}