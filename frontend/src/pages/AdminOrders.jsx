import React, { useEffect, useState } from "react";
import { FaBox, FaCalendarAlt, FaCheckCircle, FaTruck, FaHourglassHalf, FaClock, FaLock, FaSearch, FaFilter } from "react-icons/fa";

const API_BASE = process.env.REACT_APP_BACKEND_URL;
 
export default function AdminOrders({ auth }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  useEffect(() => {
    if (auth?.isAdmin) {
      fetch(`${API_BASE}/api/admin/orders`, {
        headers: { "auth-token": auth.token },
      })
        .then((res) => res.json())
        .then((data) => {
          setOrders(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [auth]);

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
              fontSize: '1rem'
            }}>
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      </>
    );
  }

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

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = 
      statusFilter === "All" || 
      order.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const uniqueStatuses = ["All", ...new Set(orders.map((o) => o.status).filter(Boolean))];

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": auth.token,
        },
        body: JSON.stringify({ status: newStatus }),
      }); 

      if (res.ok) {
        // Update local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        alert("Order status updated successfully!");
      } else {
        alert("Failed to update order status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating order status");
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

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

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .admin-orders-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }

        .admin-orders-header {
          background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 24px rgba(240, 147, 251, 0.3);
          animation: fadeIn 0.6s ease-out;
        }

        .admin-orders-title {
          color: white;
          font-size: 2.25rem;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .filters-section {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .search-wrapper {
          flex: 1;
          min-width: 250px;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #a0aec0;
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f7fafc;
        }

        .search-input:focus {
          outline: none;
          border-color: #f093fb;
          background: white;
          box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.1);
        }

        .filter-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .filter-label {
          color: #4a5568;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          background: white;
          color: #2d3748;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
        }

        .filter-select:focus {
          border-color: #f093fb;
          box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.1);
        }

        .orders-table-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          animation: fadeIn 0.6s ease-out;
        }

        .orders-table {
          width: 100%;
          border-collapse: collapse;
        }

        .orders-table thead {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        }

        .orders-table th {
          padding: 1.25rem 1.5rem;
          text-align: left;
          font-weight: 700;
          color: #2d3748;
          font-size: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .orders-table tbody tr {
          border-bottom: 1px solid #f7fafc;
          transition: all 0.3s ease;
          animation: slideIn 0.5s ease-out;
        }

        .orders-table tbody tr:hover {
          background: linear-gradient(135deg, #fef5ff 0%, #fff5f7 100%);
          transform: translateX(4px);
        }

        .orders-table td {
          padding: 1.25rem 1.5rem;
          color: #4a5568;
          font-size: 0.95rem;
        }

        .order-id-cell {
          font-family: monospace;
          font-weight: 600;
          color: #667eea;
        }

        .user-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          flex-shrink: 0;
        }

        .user-email {
          font-weight: 600;
          color: #2d3748;
        }

        .status-badge-table {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .status-dropdown {
          padding: 0.5rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
          background: white;
          color: #2d3748;
        }

        .status-dropdown:hover {
          border-color: #f093fb;
        }

        .status-dropdown:focus {
          border-color: #f093fb;
          box-shadow: 0 0 0 3px rgba(240, 147, 251, 0.1);
        }

        .status-dropdown option {
          padding: 0.5rem;
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #718096;
        }

        .total-cell {
          font-weight: 700;
          font-size: 1.1rem;
          color: #f093fb;
        }

        .empty-state {
          padding: 4rem 2rem;
          text-align: center;
          color: #718096;
        }

        .empty-icon {
          width: 100px;
          height: 100px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stats-row {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .stat-card {
          flex: 1;
          min-width: 200px;
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-label {
          color: #718096;
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          color: #2d3748;
          font-size: 1.5rem;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .admin-orders-title {
            font-size: 1.75rem;
          }

          .filters-section {
            flex-direction: column;
            align-items: stretch;
          }

          .search-wrapper {
            min-width: 100%;
          }

          .orders-table {
            font-size: 0.875rem;
          }

          .orders-table th,
          .orders-table td {
            padding: 1rem;
          }

          .user-cell {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        @media (max-width: 992px) {
          .orders-table-card {
            overflow-x: auto;
          }

          .orders-table {
            min-width: 800px;
          }
        }
      `}</style>

      <div className="admin-orders-container">
        <div className="container">
          <div className="admin-orders-header">
            <h1 className="admin-orders-title">
              <FaBox size={40} />
              Orders Management
            </h1>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#f0fff4' }}>
                <FaBox size={24} color="#48bb78" />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Orders</div>
                <div className="stat-value">{orders.length}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#fffaf0' }}>
                <FaHourglassHalf size={24} color="#ed8936" />
              </div>
              <div className="stat-content">
                <div className="stat-label">Pending</div>
                <div className="stat-value">
                  {orders.filter(o => (o.status || "").toLowerCase() === "pending" || (o.status || "").toLowerCase() === "processing").length}
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#f0fff4' }}>
                <FaCheckCircle size={24} color="#48bb78" />
              </div>
              <div className="stat-content">
                <div className="stat-label">Delivered</div>
                <div className="stat-value">
                  {orders.filter(o => (o.status || "").toLowerCase() === "delivered" || (o.status || "").toLowerCase() === "completed").length}
                </div>
              </div>
            </div>
          </div>

          <div className="filters-section">
            <div className="search-wrapper">
              <FaSearch className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search by email or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-wrapper">
              <div className="filter-label">
                <FaFilter size={16} />
                Status:
              </div>
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {uniqueStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="orders-table-card">
            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaBox size={50} color="#cbd5e0" />
                </div>
                <h3 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>No Orders Found</h3>
                <p>No orders match your search criteria.</p>
              </div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    const userInitial = order.user?.email?.[0]?.toUpperCase() || "?";

                    return (
                      <tr key={order._id}>
                        <td className="order-id-cell">
                          #{order._id?.slice(-8).toUpperCase() || "N/A"}
                        </td>
                        <td>
                          <div className="user-cell">
                            <div className="user-icon-wrapper">{userInitial}</div>
                            <span className="user-email">{order.user?.email || "Unknown"}</span>
                          </div>
                        </td>
                        <td>
                          <div
                            className="status-badge-table"
                            style={{
                              color: statusConfig.color,
                              background: statusConfig.bg,
                            }}
                          >
                            <StatusIcon size={16} />
                            {statusConfig.label}
                          </div>
                        </td>
                        <td>
                          <div className="date-cell">
                            <FaCalendarAlt size={14} />
                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                        </td>
                        <td className="total-cell">
                          ₹{order.totalPrice || 0}
                        </td>
                        <td>
                          <select
                            className="status-dropdown"
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}