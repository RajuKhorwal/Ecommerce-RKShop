import React, { useEffect, useState } from "react";
import {
  FaShoppingBag,
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch, 
} from "react-icons/fa";

const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function AdminProducts({ auth }) {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth?.isAdmin) {
      refreshProducts();
    }
  }, [auth]);

  const refreshProducts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Refresh products failed:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
        headers: { "auth-token": auth.token },
      });
      refreshProducts();
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const form = e.target;
      const formData = new FormData();
      formData.append("name", form.name.value);
      formData.append("price", form.price.value);
      formData.append("description", form.description.value);
      formData.append("stock", form.stock.value);
      formData.append("category", form.category.value);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await fetch(`${API_BASE}/api/products/addproduct`, {
        method: "POST",
        headers: { "auth-token": auth.token },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to add product");

      setAdding(false);
      setSelectedFile(null);
      setImagePreview(null);
      refreshProducts();
      alert("Product added successfully!");
    } catch (err) {
      console.error("Add product failed:", err);
      alert("Error adding product");
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const form = e.target;
      const formData = new FormData();
      formData.append("name", form.name.value);
      formData.append("price", form.price.value);
      formData.append("description", form.description.value);
      formData.append("stock", form.stock.value);
      formData.append("category", form.category.value);

      if (selectedFile) {
        formData.append("image", selectedFile);
      }

      const res = await fetch(`${API_BASE}/api/products/${editing._id}`, {
        method: "PUT",
        headers: { "auth-token": auth.token },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to update product");

      setEditing(null);
      setSelectedFile(null);
      setImagePreview(null);
      refreshProducts();
      alert("Product updated successfully!");
    } catch (err) {
      console.error("Edit product failed:", err);
      alert("Error updating product");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  if (!auth?.isAdmin) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "white",
            borderRadius: "24px",
            padding: "3rem 2rem",
            textAlign: "center",
            maxWidth: "500px",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          <h3
            style={{ color: "#2d3748", fontSize: "1.75rem", fontWeight: 700 }}
          >
            Access Denied
          </h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            color: "#667eea",
            fontSize: "1.2rem",
            fontWeight: 600,
          }}
        >
          Loading Products...
        </div>
      </div>
    );
  }

  const filteredProducts = products.filter((p) =>
    [p.name, p.category].join(" ").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        .admin-products-container { background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); min-height: 100vh; padding: 2rem 0; }
        .admin-products-header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 20px; padding: 2rem; margin-bottom: 2rem; box-shadow: 0 8px 24px rgba(79, 172, 254, 0.3); }
        .admin-products-title { color: white; font-size: 2.25rem; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 1rem; }
        .toolbar { background: white; border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); display: flex; gap: 1rem; flex-wrap: wrap; align-items: center; justify-content: space-between; }
        .search-wrapper { flex: 1; min-width: 250px; position: relative; }
        .search-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #a0aec0; pointer-events: none; }
        .search-input { width: 100%; padding: 0.875rem 1rem 0.875rem 2.75rem; border: 2px solid #e2e8f0; border-radius: 12px; font-size: 1rem; transition: all 0.3s ease; background: #f7fafc; }
        .search-input:focus { outline: none; border-color: #4facfe; background: white; box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1); }
        .add-button { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; border: none; border-radius: 12px; padding: 0.875rem 1.5rem; font-weight: 600; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 0.5rem; }
        .add-button:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(79, 172, 254, 0.4); }
        .products-table-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); }
        .products-table { width: 100%; border-collapse: collapse; }
        .products-table thead { background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); }
        .products-table th { padding: 1.25rem 1.5rem; text-align: left; font-weight: 700; color: #2d3748; font-size: 1rem; border-bottom: 2px solid #e2e8f0; }
        .products-table tbody tr { border-bottom: 1px solid #f7fafc; transition: all 0.3s ease; }
        .products-table tbody tr:hover { background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); }
        .products-table td { padding: 1.25rem 1.5rem; color: #4a5568; font-size: 0.95rem; }
        .product-name-cell { font-weight: 600; color: #2d3748; }
        .price-cell { font-weight: 700; color: #4facfe; font-size: 1.1rem; }
        .stock-badge { display: inline-block; padding: 0.4rem 0.8rem; border-radius: 20px; font-weight: 600; font-size: 0.875rem; }
        .stock-high { background: #f0fff4; color: #48bb78; }
        .stock-medium { background: #fffaf0; color: #ed8936; }
        .stock-low { background: #fff5f5; color: #f56565; }
        .action-button { background: none; border: none; width: 36px; height: 36px; border-radius: 8px; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s ease; margin: 0 0.25rem; }
        .action-button:hover { transform: scale(1.15); }
        .edit-button { color: #4facfe; background: #f0f9ff; }
        .edit-button:hover { background: #4facfe; color: white; }
        .delete-button { color: #f56565; background: #fff5f5; }
        .delete-button:hover { background: #f56565; color: white; }
        .modal.show { display: block !important; }
        .modal-dialog { max-width: 600px; margin: 1.75rem auto; }
        .modal-content { border-radius: 20px; border: none; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
        .modal-header { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 20px 20px 0 0; padding: 1.5rem 2rem; border: none; }
        .modal-title { color: white; font-size: 1.5rem; font-weight: 700; }
        .btn-close { background: rgba(255,255,255,0.3); border-radius: 50%; opacity: 1; }
        .btn-close:hover { background: rgba(255,255,255,0.5); }
        .modal-body { padding: 2rem; max-height: 60vh; overflow-y: auto; }
        .form-label { font-weight: 600; color: #2d3748; margin-bottom: 0.5rem; }
        .form-control { border: 2px solid #e2e8f0; border-radius: 10px; padding: 0.875rem 1rem; background: #f7fafc; transition: all 0.3s ease; }
        .form-control:focus { border-color: #4facfe; background: white; box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1); }
        .img-thumbnail { border-radius: 12px; border: 2px solid #e2e8f0; }
        .modal-footer { border-top: 2px solid #f7fafc; padding: 1.5rem 2rem; }
        .btn-secondary { border: 2px solid #e2e8f0; background: white; color: #4a5568; font-weight: 600; }
        .btn-secondary:hover { background: #f7fafc; border-color: #cbd5e0; }
        .btn-primary { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border: none; font-weight: 600; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(79, 172, 254, 0.4); }
      `}</style>

      <div className="admin-products-container">
        <div className="container">
          <div className="admin-products-header">
            <h1 className="admin-products-title">
              <FaShoppingBag size={40} />
              Products Management
            </h1>
          </div>

          <div className="toolbar">
            <div className="search-wrapper">
              <FaSearch className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button className="add-button" onClick={() => setAdding(true)}>
              <FaPlus size={16} />
              Add Product
            </button>
          </div>

          <div className="products-table-card">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((p) => (
                  <tr key={p._id}>
                    <td className="product-name-cell">{p.name}</td>
                    <td className="price-cell">₹{p.price}</td>
                    <td>
                      <span
                        className={`stock-badge ${
                          p.stock > 50
                            ? "stock-high"
                            : p.stock > 10
                            ? "stock-medium"
                            : "stock-low"
                        }`}
                      >
                        {p.stock ?? 0} units
                      </span>
                    </td>
                    <td>{p.category || "N/A"}</td>
                    <td>
                      <button
                        className="action-button edit-button"
                        onClick={() => {
                          setEditing(p);
                          setImagePreview(
                            p.image ? `${API_BASE}${p.image}` : null
                          );
                        }}
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDelete(p._id)}
                      >
                        <FaTrash size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Modal - BOOTSTRAP MODAL */}
      {adding && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleAdd}>
                <div className="modal-header">
                  <h5 className="modal-title">Add New Product</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setAdding(false)}
                  />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      name="name"
                      className="form-control"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price (₹)</label>
                    <input
                      name="price"
                      type="number"
                      className="form-control"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input
                      name="stock"
                      type="number"
                      className="form-control"
                      placeholder="0"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input
                      name="category"
                      className="form-control"
                      placeholder="Enter category"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      placeholder="Enter description"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setAdding(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleEdit}>
                <div className="modal-header">
                  <h5 className="modal-title">Edit Product</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditing(null)}
                  />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleFileChange}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        style={{ maxHeight: "150px" }}
                      />
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <input
                      name="name"
                      className="form-control"
                      defaultValue={editing.name}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price (₹)</label>
                    <input
                      name="price"
                      type="number"
                      className="form-control"
                      defaultValue={editing.price}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Stock</label>
                    <input
                      name="stock"
                      type="number"
                      className="form-control"
                      defaultValue={editing.stock}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input
                      name="category"
                      className="form-control"
                      defaultValue={editing.category}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      defaultValue={editing.description}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Update Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
