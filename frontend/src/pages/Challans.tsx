import { useEffect, useState } from "react";
import api from "../services/api";

interface Customer {
  id: number;
  name: string;
  businessName?: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  price: number | string;
  currentStock: number;
}

interface ChallanItem {
  id: number;
  productNameSnapshot: string;
  skuSnapshot: string;
  quantity: number;
  unitPriceSnapshot: string;
}

interface Challan {
  id: number;
  challanNumber: string;
  customerId: number;
  totalQuantity: number;
  status: string;
  createdAt: string;
  customer?: Customer;
  items?: ChallanItem[];
}

export default function Challans() {
  const [challans, setChallans] = useState<Challan[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [selectedChallan, setSelectedChallan] =
    useState<Challan | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const [challansRes, customersRes, productsRes] =
        await Promise.all([
          api.get("/challans"),
          api.get("/customers"),
          api.get("/products"),
        ]);

      const challanData = Array.isArray(challansRes.data)
        ? challansRes.data
        : challansRes.data.challans || [];

      const customerData = Array.isArray(customersRes.data)
        ? customersRes.data
        : customersRes.data.customers || [];

      const productData = Array.isArray(productsRes.data)
        ? productsRes.data
        : productsRes.data.products || [];

      setChallans(challanData);
      setCustomers(customerData);
      setProducts(productData);
    } catch (err) {
      console.error(err);
      setError("Failed to load challans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createChallan = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId || !productId || !quantity) {
      setError("Please fill all fields");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await api.post("/challans", {
        customerId: Number(customerId),
        items: [
          {
            productId: Number(productId),
            quantity: Number(quantity),
          },
        ],
      });

      setCustomerId("");
      setProductId("");
      setQuantity("1");
      setShowForm(false);

      await loadData();
    } catch (err: unknown) {
      console.error(err);

      const errorMessage =
        typeof err === "object" &&
        err !== null &&
        "response" in err
          ? (
              err as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response?.data?.message
          : undefined;

      setError(errorMessage || "Failed to create challan");
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // VIEW CHALLAN DETAILS
  // -----------------------------
  const viewChallan = async (id: number) => {
    setLoadingDetails(true);
    setError("");

    try {
      const response = await api.get(`/challans/${id}`);

      const challan = response.data.challan || response.data;

      setSelectedChallan(challan);
    } catch (err) {
      console.error(err);
      setError("Failed to load challan details");
    } finally {
      setLoadingDetails(false);
    }
  };

  // -----------------------------
  // CONFIRM CHALLAN
  // -----------------------------
  const confirmChallan = async (
    id: number,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();

    setActionLoading(id);
    setError("");

    try {
      await api.patch(`/challans/${id}/confirm`);

      await loadData();

      // Refresh details if currently open
      if (selectedChallan?.id === id) {
        await viewChallan(id);
      }
    } catch (err: unknown) {
      console.error(err);

      const errorMessage =
        typeof err === "object" &&
        err !== null &&
        "response" in err
          ? (
              err as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response?.data?.message
          : undefined;

      setError(
        errorMessage ||
          "Failed to confirm challan. Check available stock."
      );
    } finally {
      setActionLoading(null);
    }
  };

  // -----------------------------
  // CANCEL CHALLAN
  // -----------------------------
  const cancelChallan = async (
    id: number,
    e?: React.MouseEvent
  ) => {
    e?.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to cancel this challan?"
    );

    if (!confirmed) {
      return;
    }

    setActionLoading(id);
    setError("");

    try {
      await api.patch(`/challans/${id}/cancel`);

      await loadData();

      if (selectedChallan?.id === id) {
        await viewChallan(id);
      }
    } catch (err: unknown) {
      console.error(err);

      const errorMessage =
        typeof err === "object" &&
        err !== null &&
        "response" in err
          ? (
              err as {
                response?: {
                  data?: {
                    message?: string;
                  };
                };
              }
            ).response?.data?.message
          : undefined;

      setError(
        errorMessage || "Failed to cancel challan"
      );
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="page-container">
      {/* HEADER */}

      <div className="page-header">
        <div>
          <p className="eyebrow">SALES</p>

          <h1>Challans</h1>

          <p className="page-subtitle">
            Create and manage delivery challans.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => {
            setError("");
            setShowForm(true);
          }}
        >
          + Create Challan
        </button>
      </div>

      {error && (
        <div className="page-error">
          {error}
        </div>
      )}

      {/* CHALLAN LIST */}

      <div className="customers-card">
        <div className="card-header">
          <div>
            <h3>All Challans</h3>

            <p>
              {challans.length} challan
              {challans.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="page-loading">
            Loading challans...
          </div>
        ) : challans.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">▧</div>

            <h3>No challans yet</h3>

            <p>
              Create your first delivery challan.
            </p>

            <button
              className="primary-button"
              onClick={() => setShowForm(true)}
            >
              + Create Challan
            </button>
          </div>
        ) : (
          <div className="challan-list">
            {challans.map((challan) => (
              <div
                className="challan-row"
                key={challan.id}
                onClick={() => viewChallan(challan.id)}
                style={{
                  cursor: "pointer",
                }}
              >
                <div className="challan-avatar">
                  #
                </div>

                <div className="challan-main">
                  <strong>
                    {challan.challanNumber}
                  </strong>

                  <span>
                    {challan.customer?.name ||
                      `Customer #${challan.customerId}`}
                  </span>
                </div>

                <div className="challan-quantity">
                  <strong>
                    {challan.totalQuantity}
                  </strong>

                  <span>items</span>
                </div>

                <span
                  className={`status-badge ${challan.status.toLowerCase()}`}
                >
                  {challan.status}
                </span>

                <div className="challan-date">
                  {new Date(
                    challan.createdAt
                  ).toLocaleDateString("en-IN")}
                </div>

                {/* ACTIONS */}

                {challan.status === "DRAFT" && (
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginLeft: "16px",
                    }}
                  >
                    <button
                      className="primary-button"
                      style={{
                        padding: "8px 14px",
                        fontSize: "13px",
                      }}
                      disabled={
                        actionLoading === challan.id
                      }
                      onClick={(e) =>
                        confirmChallan(
                          challan.id,
                          e
                        )
                      }
                    >
                      {actionLoading === challan.id
                        ? "..."
                        : "Confirm"}
                    </button>

                    <button
                      className="secondary-button"
                      style={{
                        padding: "8px 14px",
                        fontSize: "13px",
                      }}
                      disabled={
                        actionLoading === challan.id
                      }
                      onClick={(e) =>
                        cancelChallan(
                          challan.id,
                          e
                        )
                      }
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CREATE CHALLAN MODAL */}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <div
            className="modal-card"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  NEW SALES DOCUMENT
                </p>

                <h2>Create Challan</h2>
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

            <form onSubmit={createChallan}>
              <div className="form-field">
                <label>Customer *</label>

                <select
                  value={customerId}
                  onChange={(e) =>
                    setCustomerId(
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers.map(
                    (customer) => (
                      <option
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.name}
                        {customer.businessName
                          ? ` — ${customer.businessName}`
                          : ""}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-field">
                <label>Product *</label>

                <select
                  value={productId}
                  onChange={(e) =>
                    setProductId(
                      e.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Select product
                  </option>

                  {products.map(
                    (product) => (
                      <option
                        key={product.id}
                        value={product.id}
                      >
                        {product.name} —{" "}
                        {product.sku} — Stock:{" "}
                        {product.currentStock}
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="form-field">
                <label>Quantity *</label>

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
                />
              </div>

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
                    ? "Creating..."
                    : "Create Challan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHALLAN DETAILS MODAL */}

      {selectedChallan && (
        <div
          className="modal-overlay"
          onClick={() =>
            setSelectedChallan(null)
          }
        >
          <div
            className="modal-card"
            style={{
              maxWidth: "700px",
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <p className="eyebrow">
                  CHALLAN DETAILS
                </p>

                <h2>
                  {selectedChallan.challanNumber}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setSelectedChallan(null)
                }
              >
                ×
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "1fr 1fr",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              <div>
                <strong>Customer</strong>

                <p>
                  {selectedChallan.customer
                    ?.name ||
                    `Customer #${selectedChallan.customerId}`}
                </p>
              </div>

              <div>
                <strong>Status</strong>

                <p>
                  <span
                    className={`status-badge ${selectedChallan.status.toLowerCase()}`}
                  >
                    {selectedChallan.status}
                  </span>
                </p>
              </div>

              <div>
                <strong>Total Quantity</strong>

                <p>
                  {selectedChallan.totalQuantity}{" "}
                  items
                </p>
              </div>

              <div>
                <strong>Created</strong>

                <p>
                  {new Date(
                    selectedChallan.createdAt
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                </p>
              </div>
            </div>

            <h3
              style={{
                marginBottom: "12px",
              }}
            >
              Products
            </h3>

            {selectedChallan.items &&
            selectedChallan.items.length > 0 ? (
              <div
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                {selectedChallan.items.map(
                  (item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        padding: "14px 16px",
                        borderBottom:
                          "1px solid #e5e7eb",
                      }}
                    >
                      <div>
                        <strong>
                          {
                            item.productNameSnapshot
                          }
                        </strong>

                        <div
                          style={{
                            fontSize:
                              "13px",
                            color:
                              "#7a8da0",
                          }}
                        >
                          {item.skuSnapshot}
                        </div>
                      </div>

                      <strong>
                        × {item.quantity}
                      </strong>
                    </div>
                  )
                )}
              </div>
            ) : (
              <p>
                No product details available.
              </p>
            )}

            {selectedChallan.status ===
              "DRAFT" && (
              <div
                className="modal-actions"
                style={{
                  marginTop: "24px",
                }}
              >
                <button
                  className="secondary-button"
                  disabled={
                    actionLoading ===
                    selectedChallan.id
                  }
                  onClick={(e) =>
                    cancelChallan(
                      selectedChallan.id,
                      e
                    )
                  }
                >
                  Cancel Challan
                </button>

                <button
                  className="primary-button"
                  disabled={
                    actionLoading ===
                    selectedChallan.id
                  }
                  onClick={(e) =>
                    confirmChallan(
                      selectedChallan.id,
                      e
                    )
                  }
                >
                  {actionLoading ===
                  selectedChallan.id
                    ? "Confirming..."
                    : "Confirm Challan"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {loadingDetails && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="page-loading">
              Loading challan details...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}