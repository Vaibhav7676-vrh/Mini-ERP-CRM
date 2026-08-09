import { useEffect, useState } from "react";
import api from "../services/api";

interface Customer {
  id: number;
  name: string;
  businessName?: string;
  mobile: string;
  customerType: string;
  status: string;
}

interface Product {
  id: number;
  name: string;
  sku: string;
  currentStock: number;
  minimumStock: number;
  warehouse: string;
}

interface Challan {
  id: number;
  challanNumber: string;
  totalQuantity: number;
  status: string;
  customer?: {
    name: string;
    businessName?: string;
  };
}

export default function Dashboard() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [challans, setChallans] = useState<Challan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
  try {
    const customersRes = await api.get("/customers");

    console.log("CUSTOMERS:", customersRes.data);

    const customersData = Array.isArray(customersRes.data)
      ? customersRes.data
      : customersRes.data.customers || [];

    setCustomers(customersData);
  } catch (error) {
    console.error("Customers dashboard error:", error);
  }

  try {
    const productsRes = await api.get("/products");

    console.log("PRODUCTS:", productsRes.data);

    const productsData = Array.isArray(productsRes.data)
      ? productsRes.data
      : productsRes.data.products || [];

    setProducts(productsData);
  } catch (error) {
    console.error("Products dashboard error:", error);
  }

  try {
    const challansRes = await api.get("/challans");

    console.log("CHALLANS:", challansRes.data);

    const challansData = Array.isArray(challansRes.data)
      ? challansRes.data
      : challansRes.data.challans || [];

    setChallans(challansData);
  } catch (error) {
    console.error("Challans dashboard error:", error);
  }

  setLoading(false);
};

    loadDashboard();
  }, []);

  const lowStockProducts = products.filter(
    (product) =>
      product.currentStock <= product.minimumStock
  );

  const confirmedChallans = challans.filter(
    (challan) => challan.status === "CONFIRMED"
  );

  if (loading) {
    return (
      <div className="page-loading">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Dashboard</h1>
          <p className="page-subtitle">
            Here's what's happening with your business today.
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">♙</div>

          <div>
            <p>Total Customers</p>
            <h2>{customers.length}</h2>
            <span>CRM records</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">▣</div>

          <div>
            <p>Total Products</p>
            <h2>{products.length}</h2>
            <span>Inventory items</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">!</div>

          <div>
            <p>Low Stock</p>
            <h2>{lowStockProducts.length}</h2>
            <span>Needs attention</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">✓</div>

          <div>
            <p>Confirmed Challans</p>
            <h2>{confirmedChallans.length}</h2>
            <span>Completed sales</span>
          </div>
        </div>
      </div>

      {/* Main dashboard grid */}
      <div className="dashboard-grid">
        {/* Recent Customers */}
        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Recent Customers</h3>
              <p>Latest CRM records</p>
            </div>

            <a href="/customers">View all</a>
          </div>

          {customers.length === 0 ? (
            <div className="empty-state">
              No customers found.
            </div>
          ) : (
            <div className="activity-list">
              {customers.slice(0, 5).map((customer) => (
                <div
                  className="activity-row"
                  key={customer.id}
                >
                  <div className="activity-avatar">
                    {customer.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="activity-info">
                    <strong>{customer.name}</strong>
                    <span>
                      {customer.businessName ||
                        customer.mobile}
                    </span>
                  </div>

                  <span className="status-badge">
                    {customer.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Challans */}
        <section className="dashboard-card">
          <div className="card-header">
            <div>
              <h3>Recent Challans</h3>
              <p>Latest sales activity</p>
            </div>

            <a href="/challans">View all</a>
          </div>

          {challans.length === 0 ? (
            <div className="empty-state">
              No challans found.
            </div>
          ) : (
            <div className="activity-list">
              {challans.slice(0, 5).map((challan) => (
                <div
                  className="activity-row"
                  key={challan.id}
                >
                  <div className="challan-icon">
                    #
                  </div>

                  <div className="activity-info">
                    <strong>
                      {challan.challanNumber}
                    </strong>

                    <span>
                      {challan.customer?.businessName ||
                        challan.customer?.name ||
                        "Customer"}{" "}
                      · {challan.totalQuantity} items
                    </span>
                  </div>

                  <span
                    className={`status-badge ${challan.status.toLowerCase()}`}
                  >
                    {challan.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Low Stock */}
      <section className="dashboard-card low-stock-card">
        <div className="card-header">
          <div>
            <h3>Inventory Attention</h3>
            <p>Products at or below minimum stock</p>
          </div>

          <a href="/inventory">View inventory</a>
        </div>

        {lowStockProducts.length === 0 ? (
          <div className="success-message">
            ✓ All products are sufficiently stocked.
          </div>
        ) : (
          <div className="stock-table">
            {lowStockProducts.slice(0, 5).map((product) => (
              <div
                className="stock-row"
                key={product.id}
              >
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.sku}</span>
                </div>

                <span className="stock-quantity">
                  {product.currentStock} units
                </span>

                <span className="low-stock-badge">
                  Low stock
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}