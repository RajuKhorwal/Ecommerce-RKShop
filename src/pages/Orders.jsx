import React, { useEffect, useState } from "react";
import { FaBox, FaShoppingBag, FaCalendarAlt, FaClock, FaCheckCircle, FaTruck, FaHourglassHalf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";


export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  const API_BASE = process.env.REACT_APP_BACKEND_URL;

  const toImgSrc = (val) =>
    !val
      ? "/fallback.png"
      : val.startsWith("http")
      ? val
      : `http://localhost:5000${val}`;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/order/myorders`, {
          headers: { "auth-token": token },
        });
        const data = await res.json();
        if (Array.isArray(data)) setOrders(data);
      } catch (err) {
        console.error(err);
      } finally { 
        setLoading(false);
      }
    })();
  }, [API_BASE, token]);

  const getStatusConfig = (status) => {
    const statusLower = (status || "").toLowerCase();
    if (statusLower === "delivered" || statusLower === "completed") {
      return {
        icon: FaCheckCircle,
        color: "#48bb78",
        bg: "#f0fff4",
        label: "Delivered",
      };
    } else if (statusLower === "shipped" || statusLower === "shipping") {
      return {
        icon: FaTruck,
        color: "#4299e1",
        bg: "#ebf8ff",
        label: "Shipped",
      };
    } else if (statusLower === "pending" || statusLower === "processing") {
      return {
        icon: FaHourglassHalf,
        color: "#ed8936",
        bg: "#fffaf0",
        label: "Processing",
      };
    } else {
      return {
        icon: FaClock,
        color: "#718096",
        bg: "#f7fafc",
        label: status || "Unknown",
      };
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{
          textAlign: 'center',
          color: '#667eea',
          fontSize: '1.2rem',
          fontWeight: 600
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            border: '5px solid #667eea',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 0.8s linear infinite'
          }} />
          Loading Orders...
        </div>
      </div>
    );
  }

  if (!orders.length) {
    return (
      <>
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
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
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              animation: 'float 3s ease-in-out infinite'
            }}>
              <FaBox size={50} color="white" />
            </div>
            <h3 style={{
              color: '#2d3748',
              fontSize: '1.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              No Orders Yet
            </h3>
            <p style={{
              color: '#718096',
              fontSize: '1rem',
              marginBottom: '2rem'
            }}>
              You haven't placed any orders. Start shopping now!
            </p>
            <button
              onClick={() => navigate('/')}
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
              Browse Products
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .orders-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }

        .orders-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          text-align: center;
        }

        .orders-title {
          color: white;
          font-size: 2.25rem;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .order-card {
          background: white;
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 1.5rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          animation: slideIn 0.5s ease-out;
        }

        .order-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.2);
        }

        .order-header-section {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #f7fafc;
        }

        .order-id-section {
          flex: 1;
        }

        .order-id {
          font-size: 1.5rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .order-date {
          color: #718096;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .order-total-section {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .order-total-label {
          font-size: 1.1rem;
          color: #4a5568;
          font-weight: 600;
        }

        .order-total-amount {
          font-size: 1.75rem;
          font-weight: 700;
          color: #667eea;
        }

        .order-items-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .order-item {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 12px;
          margin-bottom: 1rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .order-item:hover {
          transform: translateX(8px);
          box-shadow: 0 4px 16px rgba(102, 126, 234, 0.15);
        }

        .order-item-image {
          width: 80px;
          height: 80px;
          border-radius: 10px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          flex-shrink: 0;
        }

        .order-item-info {
          flex: 1;
        }

        .order-item-name {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.25rem;
        }

        .order-item-details {
          color: #718096;
          font-size: 0.95rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .orders-title {
            font-size: 1.75rem;
          }

          .order-header-section {
            flex-direction: column;
            gap: 1rem;
          }

          .order-item {
            flex-direction: column;
            text-align: center;
          }

          .order-item-image {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>

      <div className="orders-container">
        <div className="container">
          <div className="orders-header">
            <h1 className="orders-title">
              <FaShoppingBag size={40} />
              Your Orders
            </h1>
          </div>

          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div key={order._id} className="order-card">
                <div className="order-header-section">
                  <div className="order-id-section">
                    <div className="order-id">
                      Order #{order._id.slice(-8).toUpperCase()}
                    </div>
                    <div className="order-date">
                      <FaCalendarAlt size={14} />
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </div>
                  </div>
                  <div
                    className="status-badge"
                    style={{
                      color: statusConfig.color,
                      background: statusConfig.bg,
                    }}
                  >
                    <StatusIcon size={18} />
                    {statusConfig.label}
                  </div>
                </div>

                <div className="order-total-section">
                  <span className="order-total-label">Total Amount:</span>
                  <span className="order-total-amount">₹{order.totalPrice}</span>
                </div>

                <div className="order-items-title">
                  <FaBox size={20} />
                  Order Items ({order.items.length})
                </div>

                <div>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <img
                        src={toImgSrc(item.image)}
                        alt={item.name || "Unknown Product"}
                        className="order-item-image"
                        onError={(e) => {
                          e.target.src = "/fallback.png";
                        }}
                      />
                      <div className="order-item-info">
                        <div className="order-item-name">{item.name}</div>
                        <div className="order-item-details">
                          Quantity: {item.quantity} × ₹{item.price} = ₹
                          {item.quantity * item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ); 
          })}
        </div>
      </div>
    </>
  );
}