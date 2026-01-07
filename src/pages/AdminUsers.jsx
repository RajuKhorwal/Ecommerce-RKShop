// src/pages/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { FaUsers, FaUser, FaEnvelope, FaCrown, FaLock, FaSearch, FaUserShield } from "react-icons/fa";

const API_BASE = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

export default function AdminUsers({ auth }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (auth?.isAdmin) {
      fetch(`${API_BASE}/api/admin/users`, {
        headers: { "auth-token": auth.token },
      })
        .then((res) => res.json())
        .then((data) => {
          setUsers(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [auth]);

  if (!auth?.isAdmin) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
        <div style={{ background: 'white', borderRadius: '24px', padding: '3rem 2rem', textAlign: 'center', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
          <div style={{ width: '100px', height: '100px', background: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <FaLock size={50} color="white" />
          </div>
          <h3 style={{ color: '#2d3748', fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Access Denied</h3>
          <p style={{ color: '#718096', fontSize: '1rem' }}>You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <div style={{ textAlign: 'center', color: '#667eea', fontSize: '1.2rem', fontWeight: 600 }}>
          <div style={{ width: '60px', height: '60px', border: '5px solid #667eea', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
          Loading Users...
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter((u) =>
    [u.name, u.email].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter(u => u.isAdmin).length;
  const regularCount = users.length - adminCount;

  return (
    <>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .admin-users-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }
        .admin-users-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          animation: fadeIn 0.6s ease-out;
        }
        .admin-users-title {
          color: white;
          font-size: 2.25rem;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 1rem;
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
        .search-bar {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .search-wrapper {
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
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .users-table-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          animation: fadeIn 0.6s ease-out;
        }
        .users-table {
          width: 100%;
          border-collapse: collapse;
        }
        .users-table thead {
          background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
        }
        .users-table th {
          padding: 1.25rem 1.5rem;
          text-align: left;
          font-weight: 700;
          color: #2d3748;
          font-size: 1rem;
          border-bottom: 2px solid #e2e8f0;
        }
        .users-table tbody tr {
          border-bottom: 1px solid #f7fafc;
          transition: all 0.3s ease;
          animation: slideIn 0.5s ease-out;
        }
        .users-table tbody tr:hover {
          background: linear-gradient(135deg, #f7faff 0%, #ede9fe 100%);
          transform: translateX(4px);
        }
        .users-table td {
          padding: 1.25rem 1.5rem;
          color: #4a5568;
          font-size: 0.95rem;
        }
        .user-cell {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .user-avatar {
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
        .user-name {
          font-weight: 600;
          color: #2d3748;
        }
        .email-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #718096;
        }
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
        }
        .admin-yes {
          background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
          color: #744210;
          box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
        }
        .admin-no {
          background: #f0f0f0;
          color: #718096;
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
        @media (max-width: 768px) {
          .admin-users-title {
            font-size: 1.75rem;
          }
          .users-table-card {
            overflow-x: auto;
          }
          .users-table {
            min-width: 600px;
          }
        }
      `}</style>

      <div className="admin-users-container">
        <div className="container">
          <div className="admin-users-header">
            <h1 className="admin-users-title">
              <FaUsers size={40} />
              Users Management
            </h1>
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#ede9fe' }}>
                <FaUsers size={24} color="#667eea" />
              </div>
              <div className="stat-content">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{users.length}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#fef3c7' }}>
                <FaCrown size={24} color="#f59e0b" />
              </div>
              <div className="stat-content">
                <div className="stat-label">Admins</div>
                <div className="stat-value">{adminCount}</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon-wrapper" style={{ background: '#dbeafe' }}>
                <FaUser size={24} color="#3b82f6" />
              </div>
              <div className="stat-content">
                <div className="stat-label">Regular Users</div>
                <div className="stat-value">{regularCount}</div>
              </div>
            </div>
          </div>

          <div className="search-bar">
            <div className="search-wrapper">
              <FaSearch className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="users-table-card">
            {filteredUsers.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaUsers size={50} color="#cbd5e0" />
                </div>
                <h3 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>No Users Found</h3>
                <p>No users match your search criteria.</p>
              </div>
            ) : (
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => {
                    const userInitial = u.name?.[0]?.toUpperCase() || "U";
                    return (
                      <tr key={u._id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">{userInitial}</div>
                            <span className="user-name">{u.name}</span>
                          </div>
                        </td>
                        <td>
                          <div className="email-cell">
                            <FaEnvelope size={14} />
                            {u.email}
                          </div>  
                        </td>
                        <td>
                          {u.isAdmin ? (
                            <span className="admin-badge admin-yes">
                              <FaCrown size={14} />
                              Admin
                            </span>
                          ) : (
                            <span className="admin-badge admin-no">
                              <FaUserShield size={14} />
                              User
                            </span>
                          )}
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