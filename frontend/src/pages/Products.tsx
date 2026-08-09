import { useEffect, useState } from "react";
import api from "../services/api";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  unitPrice: string | number;
  currentStock: number;
  minimumStock: number;
  warehouse: string;
}

const emptyForm = {
  name: "",
  sku: "",
  category: "",
  unitPrice: "",
  currentStock: "0",
  minimumStock: "0",
  warehouse: "",
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.products || [];

      setProducts(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (product: Product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      sku: product.sku,
      category: product.category,
      unitPrice: String(product.unitPrice),
      currentStock: String(product.currentStock),
      minimumStock: String(product.minimumStock),
      warehouse: product.warehouse,
    });

    setError("");
    setShowForm(true);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const payload = {
        name: form.name,
        sku: form.sku,
        category: form.category,
        unitPrice: Number(form.unitPrice),
        currentStock: Number(form.currentStock),
        minimumStock: Number(form.minimumStock),
        warehouse: form.warehouse,
      };

      if (editingId) {
        await api.put(
          `/products/${editingId}`,
          payload
        );
      } else {
        await api.post("/products", payload);
      }

      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);

      await loadProducts();
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to save product"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this product?"
      )
    ) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      await loadProducts();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Failed to delete product"
      );
    }
  };

  const filteredProducts = products.filter((product) => {
    const query = search.toLowerCase();

    return (
      product.name.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.warehouse.toLowerCase().includes(query)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="page-header customers-header">
        <div>
          <p className="eyebrow">INVENTORY</p>

          <h1>Products</h1>

          <p className="page-subtitle">
            Manage products, pricing and inventory.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddForm}
        >
          + Add Product
        </button>
      </div>

      {/* Search */}
      <div className="customer-toolbar">
        <input
          className="search-input"
          placeholder="Search by name, SKU, category or warehouse..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <span className="customer-count">
          {filteredProducts.length} products
        </span>
      </div>

      {error && !showForm && (
        <div className="page-error">
          {error}
        </div>
      )}

      {/* Products */}
      <div className="customers-card">
        {loading ? (
          <div className="page-loading">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="customer-empty">
            <div className="empty-icon">▣</div>

            <h3>
              {search
                ? "No products found"
                : "No products yet"}
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "Add your first product to get started."}
            </p>

            {!search && (
              <button
                className="primary-button"
                onClick={openAddForm}
              >
                + Add Product
              </button>
            )}
          </div>
        ) : (
          <div className="customer-list">
            {filteredProducts.map((product) => {
              const lowStock =
                product.currentStock <=
                product.minimumStock;

              return (
                <div
                  className="customer-row"
                  key={product.id}
                >
                  <div className="customer-avatar">
                    {product.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="customer-main">
                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      SKU: {product.sku}
                    </span>
                  </div>

                  <div className="customer-contact">
                    <strong>
                      ₹
                      {Number(
                        product.unitPrice
                      ).toLocaleString("en-IN")}
                    </strong>

                    <span>
                      {product.category}
                    </span>
                  </div>

                  <div className="product-stock">
                    <strong>
                      {product.currentStock}
                    </strong>

                    <span>
                      / min {product.minimumStock}
                    </span>
                  </div>

                  <span
                    className={
                      lowStock
                        ? "low-stock-badge"
                        : "stock-ok-badge"
                    }
                  >
                    {lowStock
                      ? "LOW STOCK"
                      : "IN STOCK"}
                  </span>

                  <div className="customer-actions">
                    <button
                      onClick={() =>
                        openEditForm(product)
                      }
                    >
                      Edit
                    </button>

                    <button
                      className="delete-action"
                      onClick={() =>
                        handleDelete(product.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="customer-modal">
            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  PRODUCT
                </p>

                <h2>
                  {editingId
                    ? "Edit Product"
                    : "Add Product"}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowForm(false)
                }
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-field">
                  <label>Name *</label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Mechanical Keyboard"
                  />
                </div>

                <div className="form-field">
                  <label>SKU *</label>

                  <input
                    name="sku"
                    value={form.sku}
                    onChange={handleChange}
                    required
                    placeholder="MK-001"
                  />
                </div>

                <div className="form-field">
                  <label>Category *</label>

                  <input
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    placeholder="Electronics"
                  />
                </div>

                <div className="form-field">
                  <label>Unit Price *</label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="unitPrice"
                    value={form.unitPrice}
                    onChange={handleChange}
                    required
                    placeholder="1499"
                  />
                </div>

                <div className="form-field">
                  <label>Current Stock</label>

                  <input
                    type="number"
                    min="0"
                    name="currentStock"
                    value={form.currentStock}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field">
                  <label>Minimum Stock</label>

                  <input
                    type="number"
                    min="0"
                    name="minimumStock"
                    value={form.minimumStock}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field full">
                  <label>Warehouse *</label>

                  <input
                    name="warehouse"
                    value={form.warehouse}
                    onChange={handleChange}
                    required
                    placeholder="Bangalore Warehouse"
                  />
                </div>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowForm(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Product"
                    : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}