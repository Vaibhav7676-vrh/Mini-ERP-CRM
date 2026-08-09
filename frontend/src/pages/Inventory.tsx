import { useEffect, useState } from "react";
import api from "../services/api";

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minimumStock: number;
  warehouse: string;
}

interface StockLog {
  id: number;
  productId: number;
  quantity: number;
  movementType: "IN" | "OUT";
  reason: string;
  createdAt: string;
  user?: {
    name: string;
  };
}

export default function Inventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);

  const [logs, setLogs] = useState<StockLog[]>([]);

  const [movementType, setMovementType] =
    useState<"IN" | "OUT">("IN");

  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  const [search, setSearch] = useState("");
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
      setError("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadLogs = async (productId: number) => {
    try {
      const response = await api.get(
        `/products/${productId}/stock-logs`
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.logs || [];

      setLogs(data);
    } catch (err) {
      console.error(err);
      setLogs([]);
    }
  };

  const selectProduct = async (product: Product) => {
    setSelectedProduct(product);
    setError("");
    await loadLogs(product.id);
  };

  const handleMovement = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedProduct) return;

    const amount = Number(quantity);

    if (!amount || amount <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (!reason.trim()) {
      setError("Reason is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const endpoint =
        movementType === "IN"
          ? `/products/${selectedProduct.id}/stock/in`
          : `/products/${selectedProduct.id}/stock/out`;

      await api.post(endpoint, {
        quantity: amount,
        reason: reason.trim(),
      });

      setQuantity("");
      setReason("");

      await loadProducts();

      const updatedProduct = products.find(
        (product) =>
          product.id === selectedProduct.id
      );

      if (updatedProduct) {
        setSelectedProduct({
          ...updatedProduct,
          currentStock:
            movementType === "IN"
              ? updatedProduct.currentStock + amount
              : updatedProduct.currentStock - amount,
        });
      }

      await loadLogs(selectedProduct.id);
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Stock movement failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(
    (product) => {
      const query = search.toLowerCase();

      return (
        product.name
          .toLowerCase()
          .includes(query) ||
        product.sku
          .toLowerCase()
          .includes(query) ||
        product.category
          .toLowerCase()
          .includes(query) ||
        product.warehouse
          .toLowerCase()
          .includes(query)
      );
    }
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <p className="eyebrow">INVENTORY</p>

          <h1>Inventory</h1>

          <p className="page-subtitle">
            Track stock levels and inventory movements.
          </p>
        </div>
      </div>

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      <div className="inventory-layout">
        {/* Product list */}
        <div className="customers-card inventory-products">
          <div className="inventory-list-header">
            <h3>Products</h3>

            <span>
              {filteredProducts.length}
            </span>
          </div>

          <input
            className="search-input inventory-search"
            placeholder="Search products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {loading ? (
            <div className="page-loading">
              Loading inventory...
            </div>
          ) : (
            <div>
              {filteredProducts.map((product) => {
                const lowStock =
                  product.currentStock <=
                  product.minimumStock;

                return (
                  <button
                    className={`inventory-product ${
                      selectedProduct?.id ===
                      product.id
                        ? "selected"
                        : ""
                    }`}
                    key={product.id}
                    onClick={() =>
                      selectProduct(product)
                    }
                  >
                    <div className="customer-avatar">
                      {product.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="inventory-product-info">
                      <strong>
                        {product.name}
                      </strong>

                      <span>
                        {product.sku}
                      </span>
                    </div>

                    <div className="inventory-product-stock">
                      <strong>
                        {product.currentStock}
                      </strong>

                      <span>units</span>
                    </div>

                    {lowStock && (
                      <span className="low-stock-badge">
                        LOW
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          {!selectedProduct ? (
            <div className="customers-card inventory-empty">
              <div className="empty-icon">
                ▣
              </div>

              <h3>Select a product</h3>

              <p>
                Select a product to view its stock
                and movements.
              </p>
            </div>
          ) : (
            <>
              {/* Product summary */}
              <div className="customers-card inventory-summary">
                <div>
                  <p className="eyebrow">
                    PRODUCT
                  </p>

                  <h2>
                    {selectedProduct.name}
                  </h2>

                  <span>
                    {selectedProduct.sku} ·{" "}
                    {selectedProduct.warehouse}
                  </span>
                </div>

                <div className="inventory-current-stock">
                  <span>Current Stock</span>

                  <strong>
                    {selectedProduct.currentStock}
                  </strong>

                  <small>
                    Minimum:{" "}
                    {selectedProduct.minimumStock}
                  </small>
                </div>
              </div>

              {/* Movement */}
              <div className="customers-card inventory-movement">
                <div className="card-header">
                  <div>
                    <h3>Stock Movement</h3>

                    <p>
                      Add or remove stock
                    </p>
                  </div>
                </div>

                <form
                  onSubmit={handleMovement}
                >
                  <div className="movement-tabs">
                    <button
                      type="button"
                      className={
                        movementType === "IN"
                          ? "active-in"
                          : ""
                      }
                      onClick={() =>
                        setMovementType("IN")
                      }
                    >
                      + Stock In
                    </button>

                    <button
                      type="button"
                      className={
                        movementType === "OUT"
                          ? "active-out"
                          : ""
                      }
                      onClick={() =>
                        setMovementType("OUT")
                      }
                    >
                      − Stock Out
                    </button>
                  </div>

                  <div className="form-grid">
                    <div className="form-field">
                      <label>
                        Quantity *
                      </label>

                      <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(
                            e.target.value
                          )
                        }
                        required
                        placeholder="10"
                      />
                    </div>

                    <div className="form-field">
                      <label>
                        Reason *
                      </label>

                      <input
                        value={reason}
                        onChange={(e) =>
                          setReason(
                            e.target.value
                          )
                        }
                        required
                        placeholder={
                          movementType ===
                          "IN"
                            ? "New stock received"
                            : "Product sold"
                        }
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      className="primary-button"
                      disabled={saving}
                    >
                      {saving
                        ? "Processing..."
                        : movementType ===
                          "IN"
                        ? "Add Stock"
                        : "Remove Stock"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Logs */}
              <div className="customers-card">
                <div className="card-header inventory-log-header">
                  <div>
                    <h3>
                      Stock History
                    </h3>

                    <p>
                      Recent inventory movements
                    </p>
                  </div>
                </div>

                {logs.length === 0 ? (
                  <div className="empty-state">
                    No stock movements yet.
                  </div>
                ) : (
                  <div className="stock-table">
                    {logs.map((log) => (
                      <div
                        className="stock-row"
                        key={log.id}
                      >
                        <div
                          className={`movement-icon ${
                            log.movementType ===
                            "IN"
                              ? "movement-in"
                              : "movement-out"
                          }`}
                        >
                          {log.movementType ===
                          "IN"
                            ? "+"
                            : "−"}
                        </div>

                        <div>
                          <strong>
                            {log.reason}
                          </strong>

                          <span>
                            {new Date(
                              log.createdAt
                            ).toLocaleString(
                              "en-IN"
                            )}
                            {log.user
                              ? ` · ${log.user.name}`
                              : ""}
                          </span>
                        </div>

                        <strong
                          className={
                            log.movementType ===
                            "IN"
                              ? "quantity-in"
                              : "quantity-out"
                          }
                        >
                          {log.movementType ===
                          "IN"
                            ? "+"
                            : "−"}
                          {log.quantity}
                        </strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}