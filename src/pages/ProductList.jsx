import React, { useEffect, useState } from "react";
import { FaShoppingCart, FaFilter, FaChevronLeft, FaChevronRight, FaTag, FaBoxOpen } from "react-icons/fa";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function ProductList({ auth, showAlert, openAuthModal }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addingToCart, setAddingToCart] = useState({});
  const PRODUCTS_PER_PAGE = 20;

  const isLoggedIn = !!auth?.token;

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const imageUrl = (pImage) => {
    if (!pImage) return null;
    return pImage.startsWith("/uploads")
      ? `http://localhost:5000${pImage}`
      : pImage;
  };

  const addToCart = async (productId) => {
    if (!isLoggedIn) {
      showAlert && showAlert("Please login first", "warning");
      openAuthModal && openAuthModal();
      return;
    }
    
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body: JSON.stringify({ items: [{ product: productId, quantity: 1 }] }),
      });
      const data = await res.json();
      if (res.ok) {
        showAlert && showAlert("Added to cart", "success");
        const count = (data?.items || []).reduce(
          (s, it) => s + (it.quantity || 0),
          0
        );
        window.dispatchEvent(
          new CustomEvent("cartUpdated", { detail: { count } })
        );
      } else {
        showAlert &&
          showAlert(data.message || "Failed to add to cart", "danger");
      }
    } catch (err) {
      console.error(err);
      showAlert && showAlert("Failed to add to cart", "danger");
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
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
          Loading Products...
        </div>
      </div>
    );
  }

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  );

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

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .products-container {
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          min-height: 100vh;
          padding: 2rem 0;
        }

        .products-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
          box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
          animation: fadeIn 0.5s ease-out;
        }

        .products-title {
          color: white;
          font-size: 2.25rem;
          font-weight: 700;
          margin: 0 0 1rem 0;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }

        .filter-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(255, 255, 255, 0.2);
          padding: 1rem 1.5rem;
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .filter-label {
          color: white;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1rem;
        }

        .filter-select {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          background: white;
          color: #2d3748;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none;
        }

        .filter-select:focus {
          border-color: #ffd700;
          box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
        }

        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .product-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeIn 0.5s ease-out;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .product-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 32px rgba(102, 126, 234, 0.3);
        }

        .product-image-container {
          position: relative;
          width: 100%;
          height: 220px;
          overflow: hidden;
          background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
        }

        .product-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .product-card:hover .product-image {
          transform: scale(1.1);
        }

        .product-category-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }

        .product-body {
          padding: 1.5rem;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .product-name {
          font-size: 1.25rem;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .product-description {
          color: #718096;
          font-size: 0.95rem;
          margin-bottom: 1rem;
          flex: 1;
          line-height: 1.5;
        }

        .product-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 2px solid #f7fafc;
        }

        .product-price {
          font-size: 1.5rem;
          font-weight: 700;
          color: #667eea;
          display: flex;
          align-items: center;
        }

        .add-to-cart-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 0.75rem 1.25rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
        }

        .add-to-cart-btn:disabled {
          background: linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%);
          cursor: not-allowed;
          opacity: 0.7;
        }

        .out-of-stock-btn {
          background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
          color: white;
          border: none;
          border-radius: 10px;
          padding: 0.75rem 1.25rem;
          font-weight: 600;
          cursor: not-allowed;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .spinner-btn {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .pagination-container {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }

        .pagination-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

        .pagination-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
        }

        .pagination-btn:disabled {
          background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
          color: #a0aec0;
          cursor: not-allowed;
        }

        .page-numbers {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
          flex: 1;
        }

        .page-number-btn {
          min-width: 40px;
          height: 40px;
          border: 2px solid #e2e8f0;
          background: white;
          color: #4a5568;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .page-number-btn:hover {
          border-color: #667eea;
          color: #667eea;
          transform: scale(1.1);
        }

        .page-number-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: transparent;
        }

        @media (max-width: 768px) {
          .products-title {
            font-size: 1.75rem;
          }

          .filter-section {
            flex-direction: column;
            align-items: stretch;
          }

          .product-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1rem;
          }

          .pagination-container {
            flex-direction: column;
          }

          .page-numbers {
            order: 2;
          }
        }
      `}</style>

      <div className="products-container">
        <div className="container">
          <div className="products-header">
            <h1 className="products-title">
              <FaBoxOpen size={40} />
              Our Products
            </h1>
            <div className="filter-section">
              <div className="filter-label">
                <FaFilter size={18} />
                Filter by Category:
              </div>
              <select
                className="filter-select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {paginatedProducts.length === 0 ? (
            <div style={{ 
              background: 'white', 
              borderRadius: '16px',
              padding: '3rem',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <FaBoxOpen size={60} color="#cbd5e0" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#4a5568', marginBottom: '0.5rem' }}>No Products Found</h3>
              <p style={{ color: '#a0aec0' }}>Try selecting a different category</p>
            </div>
          ) : (
            <>
              <div className="product-grid">
                {paginatedProducts.map((p) => (
                  <div className="product-card" key={p._id}>
                    <div className="product-image-container">
                      {p.image ? (
                        <img
                          src={imageUrl(p.image)}
                          className="product-image"
                          alt={p.name}
                          loading="lazy"
                          onError={(e) => {
                            e.target.src = "/fallback.png";
                          }}
                        />
                      ) : (
                        <div style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)'
                        }}>
                          <FaBoxOpen size={60} color="#a0aec0" />
                        </div>
                      )}
                      {p.category && (
                        <div className="product-category-badge">
                          <FaTag size={12} />
                          {p.category}
                        </div>
                      )}
                    </div>
                    <div className="product-body">
                      <div className="product-name">{p.name}</div>
                      <div className="product-description">
                        {p.description || "No description available"}
                      </div>
                      <div className="product-footer">
                        <div className="product-price">₹{p.price}</div>
                        {p.stock === 0 ? (
                          <button className="out-of-stock-btn" disabled>
                            <FaBoxOpen size={16} />
                            Out of Stock
                          </button>
                        ) : (
                          <button
                            className="add-to-cart-btn"
                            onClick={() => addToCart(p._id)}
                            disabled={addingToCart[p._id]}
                          >
                            {addingToCart[p._id] ? (
                              <>
                                <div className="spinner-btn" />
                                Adding...
                              </>
                            ) : (
                              <>
                                <FaShoppingCart size={16} />
                                Add to Cart
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="pagination-container">
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <FaChevronLeft size={14} />
                    Previous
                  </button>

                  <div className="page-numbers">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <button
                          key={pageNum}
                          className={`page-number-btn ${
                            pageNum === currentPage ? "active" : ""
                          }`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
                    <FaChevronRight size={14} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}