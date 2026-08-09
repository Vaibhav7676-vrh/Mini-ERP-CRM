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

  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("1");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to create challan"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
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
              </div>
            ))}
          </div>
        )}
      </div>

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
                    setCustomerId(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer.id}
                      value={customer.id}
                    >
                      {customer.name}
                      {customer.businessName
                        ? ` — ${customer.businessName}`
                        : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Product *</label>

                <select
                  value={productId}
                  onChange={(e) =>
                    setProductId(e.target.value)
                  }
                  required
                >
                  <option value="">
                    Select product
                  </option>

                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.name} —{" "}
                      {product.sku} — Stock:{" "}
                      {product.currentStock}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field">
                <label>Quantity *</label>

                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(e.target.value)
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
    </div>
  );
}