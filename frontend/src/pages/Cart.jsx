import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaTrash, FaMinus, FaPlus, FaCheckCircle, FaExclamationTriangle, FaMoneyBillWave, FaCreditCard } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Cart({ showAlert }) {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [updating, setUpdating] = useState({});
  const [placing, setPlacing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const token = localStorage.getItem("token");

  const API_BASE = process.env.REACT_APP_BACKEND_URL;

  const toImgSrc = (val) =>
    !val
      ? "/fallback.png"
      : val.startsWith("http")
      ? val
      : `http://localhost:5000${val}`;

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        headers: { "auth-token": token },
      });
      const data = res.ok ? await res.json() : { items: [] };
      setCart(data || { items: [] });
      dispatchCartUpdated(data || { items: [] });
    } catch (err) {
      console.error(err);
      setCart({ items: [] });
    }
  };

  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatchCartUpdated = (cartObj) => {
    const count = (cartObj?.items || []).reduce(
      (s, it) => s + (it.quantity || 0),
      0
    );
    window.dispatchEvent(new CustomEvent("cartUpdated", { detail: { count } }));
  };

  const apiUpdateQty = async (productId, quantity) => {
    const res = await fetch(
      `${API_BASE}/api/cart/update/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
        body: JSON.stringify({ quantity }),
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.msg || "Update failed");
    }
    return await res.json();
  };

  const apiRemoveItem = async (productId) => {
    const res = await fetch(
      `${API_BASE}/api/cart/remove/${productId}`,
      {
        method: "DELETE",
        headers: { "auth-token": token },
      }
    );
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || err.msg || "Remove failed");
    }
    return await res.json();
  };

  const updateQty = async (productId, newQty) => {
    if (newQty < 1) return removeItem(productId);
    if (!cart) return;

    const prevCart = JSON.parse(JSON.stringify(cart));
    const newCart = {
      ...cart,
      items: cart.items.map((it) =>
        it.product._id === productId ? { ...it, quantity: newQty } : it
      ),
    };
    setCart(newCart);
    dispatchCartUpdated(newCart);

    setUpdating((prev) => ({ ...prev, [productId]: true }));
    try {
      await apiUpdateQty(productId, newQty);
      await fetchCart();
    } catch (err) {
      console.error("Update failed:", err);
      setCart(prevCart);
      dispatchCartUpdated(prevCart);
      showAlert && showAlert(err.message || "Update failed", "danger");
    } finally {
      setUpdating((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    }
  };

  const removeItem = async (productId) => {
    if (!cart) return;

    const prevCart = JSON.parse(JSON.stringify(cart));
    const newCart = {
      ...cart,
      items: cart.items.filter((it) => it.product._id !== productId),
    };
    setCart(newCart);
    dispatchCartUpdated(newCart);

    setUpdating((prev) => ({ ...prev, [productId]: true }));
    try {
      await apiRemoveItem(productId);
      await fetchCart();
      showAlert && showAlert("Removed from cart", "success");
    } catch (err) {
      console.error("Remove failed:", err);
      setCart(prevCart);
      dispatchCartUpdated(prevCart);
      showAlert && showAlert(err.message || "Remove failed", "danger");
    } finally {
      setUpdating((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });
    }
  };

  const handlePlaceOrderClick = () => {
    setShowPaymentModal(true);
  };

  const placeOrder = async () => {
    setPlacing(true);
    setShowPaymentModal(false);
    
    try {
      const res = await fetch(`${API_BASE}/api/order/create`, {
        method: "POST",
        headers: { "auth-token": token },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Order failed");

      setCart({ items: [] });
      dispatchCartUpdated({ items: [] });
      showAlert && showAlert("Order placed successfully (COD)", "success");
      navigate('/orders');
    } catch (err) {
      console.error(err);
      showAlert && showAlert(err.message || "Order failed", "danger");
    } finally {
      setPlacing(false);
    }
  };

  if (!cart) {
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
            width: '50px',
            height: '50px',
            border: '4px solid #667eea',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            margin: '0 auto 1rem',
            animation: 'spin 0.8s linear infinite'
          }} />
          Loading cart...
        </div>
      </div>
    );
  }

  if (!cart.items || cart.items.length === 0) {
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
              <FaShoppingCart size={50} color="white" />
            </div>
            <h3 style={{
              color: '#2d3748',
              fontSize: '1.75rem',
              fontWeight: 700,
              marginBottom: '0.5rem'
            }}>
              Your Cart is Empty
            </h3>
            <p style={{
              color: '#718096',
              fontSize: '1rem',
              marginBottom: '2rem'
            }}>
              Add some products to get started with shopping!
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

  const totalAmount = cart.items.reduce(
    (sum, item) =>
      item.product
        ? sum + (item.product.price || 0) * (item.quantity || 0)
        : sum,
    0
  );

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

        .cart-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }

        .cart-header {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        .cart-title {
          color: #2d3748;
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .cart-items-container {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
        }

        .cart-item {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
          border-radius: 16px;
          margin-bottom: 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transition: all 0.3s ease;
          animation: slideIn 0.5s ease-out;
        }

        .cart-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
        }

        .cart-item-image {
          width: 100px;
          height: 100px;
          border-radius: 12px;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .cart-item-info {
          flex: 1;
        }

        .cart-item-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
        }

        .cart-item-price {
          font-size: 1.1rem;
          color: #667eea;
          font-weight: 600;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #f7fafc;
          padding: 0.5rem 1rem;
          border-radius: 12px;
        }

        .quantity-btn {
          width: 36px;
          height: 36px;
          border: 2px solid #667eea;
          background: white;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #667eea;
          font-weight: 700;
        }

        .quantity-btn:hover:not(:disabled) {
          background: #667eea;
          color: white;
          transform: scale(1.1);
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-display {
          min-width: 40px;
          text-align: center;
          font-weight: 700;
          font-size: 1.1rem;
          color: #2d3748;
        }

        .remove-btn {
          background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 0.75rem 1.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .remove-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(252, 129, 129, 0.4);
        }

        .remove-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .cart-summary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          color: white;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .summary-label {
          font-size: 1rem;
          opacity: 0.9;
        }

        .summary-total {
          font-size: 2rem;
          font-weight: 700;
        }

        .place-order-btn {
          width: 100%;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 12px;
          padding: 1.25rem;
          font-size: 1.25rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
        }

        .place-order-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(255, 255, 255, 0.3);
        }

        .place-order-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .invalid-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%);
          border-radius: 16px;
          margin-bottom: 1rem;
          color: #e53e3e;
          font-weight: 600;
          box-shadow: 0 4px 12px rgba(229, 62, 62, 0.2);
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 3px solid rgba(102, 126, 234, 0.3);
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .payment-modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          z-index: 1040;
        }

        .payment-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          border-radius: 20px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          z-index: 1050;
        }

        .payment-modal-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .payment-option {
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .payment-option:hover {
          border-color: #667eea;
          background: #f7faff;
        }

        .payment-option.selected {
          border-color: #667eea;
          background: linear-gradient(135deg, #f7faff 0%, #ede9fe 100%);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
        }

        .payment-option.disabled {
          opacity: 0.6;
          cursor: not-allowed;
          background: #f7fafc;
        }

        .payment-option.disabled:hover {
          border-color: #e2e8f0;
          background: #f7fafc;
        }

        .payment-option-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .payment-option-content {
          flex: 1;
        }

        .payment-option-title {
          font-weight: 700;
          color: #2d3748;
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
        }

        .payment-option-desc {
          color: #718096;
          font-size: 0.9rem;
        }

        .coming-soon-badge {
          background: #ffd700;
          color: #744210;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .payment-modal-buttons {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
        }

        .payment-btn {
          flex: 1;
          padding: 1rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          font-size: 1rem;
        }

        .payment-btn-cancel {
          background: #f7fafc;
          color: #4a5568;
          border: 2px solid #e2e8f0;
        }

        .payment-btn-cancel:hover {
          background: #edf2f7;
        }

        .payment-btn-confirm {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .payment-btn-confirm:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        @media (max-width: 768px) {
          .cart-item {
            flex-direction: column;
            text-align: center;
          }

          .cart-item-image {
            width: 80px;
            height: 80px;
          }

          .cart-title {
            font-size: 1.5rem;
          }
        }
      `}</style>

      <div className="cart-container">
        <div className="container">
          <div className="cart-header">
            <h1 className="cart-title">
              <FaShoppingCart size={40} style={{ color: '#667eea' }} />
              Your Shopping Cart
            </h1>
          </div>

          <div className="cart-items-container">
            {cart.items.map((item, index) => {
              if (!item.product) {
                return (
                  <div key={`invalid-${index}`} className="invalid-item">
                    <FaExclamationTriangle size={24} />
                    <span>Product no longer available (removed by admin)</span>
                  </div>
                );
              }
              const key = `${item.product._id}-${index}`;
              const pid = item.product._id;
              return (
                <div key={key} className="cart-item">
                  <img
                    src={toImgSrc(item.product?.image)}
                    alt={item.product?.name || "Product"}
                    className="cart-item-image"
                  />
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.product.name}</div>
                    <div className="cart-item-price">₹{item.product.price}</div>
                  </div>

                  <div className="quantity-controls">
                    <button
                      className="quantity-btn"
                      onClick={() => updateQty(pid, item.quantity - 1)}
                      disabled={!!updating[pid]}
                    >
                      <FaMinus size={12} />
                    </button>

                    <div className="quantity-display">
                      {updating[pid] ? (
                        <div className="spinner-small" />
                      ) : (
                        item.quantity
                      )}
                    </div>

                    <button
                      className="quantity-btn"
                      onClick={() => updateQty(pid, item.quantity + 1)}
                      disabled={!!updating[pid]}
                    >
                      <FaPlus size={12} />
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(pid)}
                    disabled={!!updating[pid]}
                  >
                    <FaTrash size={16} />
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span className="summary-label">Items:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {cart.items.length}
              </span>
            </div>
            <div className="summary-row">
              <span className="summary-label">Total Amount:</span>
              <span className="summary-total">₹{totalAmount}</span>
            </div>
            <button
              className="place-order-btn"
              onClick={handlePlaceOrderClick}
              disabled={placing}
            >
              {placing ? (
                <>
                  <div className="spinner-small" style={{ borderTopColor: '#667eea' }} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FaCheckCircle size={24} />
                  <span>Proceed to Payment</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <>
          <div className="payment-modal-backdrop" onClick={() => setShowPaymentModal(false)} />
          <div className="payment-modal">
            <h2 className="payment-modal-title">Select Payment Method</h2>
            
            {/* COD Option */}
            <div
              className={`payment-option ${paymentMethod === "COD" ? "selected" : ""}`}
              onClick={() => setPaymentMethod("COD")}
            >
              <div className="payment-option-icon" style={{ background: '#fff5f5', color: '#f56565' }}>
                <FaMoneyBillWave />
              </div>
              <div className="payment-option-content">
                <div className="payment-option-title">Cash on Delivery</div>
                <div className="payment-option-desc">Pay when you receive your order</div>
              </div>
              {paymentMethod === "COD" && <FaCheckCircle color="#667eea" size={24} />}
            </div>

            {/* Online Payment - Disabled */}
            <div
              className="payment-option disabled"
              onClick={() => {
                showAlert && showAlert("Online payment is currently not available. Please use Cash on Delivery.", "warning");
              }}
            >
              <div className="payment-option-icon" style={{ background: '#f0f0f0', color: '#a0aec0' }}>
                <FaCreditCard />
              </div>
              <div className="payment-option-content">
                <div className="payment-option-title">Online Payment</div>
                <div className="payment-option-desc">Currently not available</div>
              </div>
              <span className="coming-soon-badge">Coming Soon</span>
            </div>

            <div className="payment-modal-buttons">
              <button
                className="payment-btn payment-btn-cancel"
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
              <button
                className="payment-btn payment-btn-confirm"
                onClick={() => {
                  if (paymentMethod === "COD") {
                    placeOrder();
                  } else {
                    showAlert && showAlert("Please select a payment method", "warning");
                  }
                }}
              >
                Confirm Order
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}