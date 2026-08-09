import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

interface Customer {
  id: number;
  name: string;
  mobile: string;
  email?: string;
  businessName?: string;
  gstNumber?: string;
  customerType: "RETAIL" | "WHOLESALE" | "DISTRIBUTOR";
  address: string;
  status: "LEAD" | "ACTIVE" | "INACTIVE";
  followUpDate?: string;
  notes?: string;
}

const emptyForm = {
  name: "",
  mobile: "",
  email: "",
  businessName: "",
  gstNumber: "",
  customerType: "RETAIL",
  address: "",
  status: "LEAD",
  followUpDate: "",
  notes: "",
};

export default function Customers() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadCustomers = async () => {
    try {
      const response = await api.get("/customers");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data.customers || [];

      setCustomers(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
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

  const openEditForm = (customer: Customer) => {
    setEditingId(customer.id);

    setForm({
      name: customer.name,
      mobile: customer.mobile,
      email: customer.email || "",
      businessName: customer.businessName || "",
      gstNumber: customer.gstNumber || "",
      customerType: customer.customerType,
      address: customer.address,
      status: customer.status,
      followUpDate: customer.followUpDate
        ? customer.followUpDate.substring(0, 10)
        : "",
      notes: customer.notes || "",
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
        ...form,
        email: form.email || undefined,
        businessName: form.businessName || undefined,
        gstNumber: form.gstNumber || undefined,
        followUpDate: form.followUpDate
          ? new Date(form.followUpDate).toISOString()
          : undefined,
        notes: form.notes || undefined,
      };

      if (editingId) {
        await api.put(
          `/customers/${editingId}`,
          payload
        );
      } else {
        await api.post("/customers", payload);
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);

      await loadCustomers();
    } catch (err: any) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          "Failed to save customer"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/customers/${id}`);
      await loadCustomers();
    } catch (err: any) {
      alert(
        err.response?.data?.message ||
          "Failed to delete customer"
      );
    }
  };

  const filteredCustomers = customers.filter(
    (customer) => {
      const query = search.toLowerCase();

      return (
        customer.name
          .toLowerCase()
          .includes(query) ||
        customer.mobile.includes(query) ||
        customer.businessName
          ?.toLowerCase()
          .includes(query) ||
        customer.email
          ?.toLowerCase()
          .includes(query)
      );
    }
  );

  return (
    <div>
      {/* Header */}
      <div className="page-header customers-header">
        <div>
          <p className="eyebrow">CRM</p>
          <h1>Customers</h1>
          <p className="page-subtitle">
            Manage your customers and relationships.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAddForm}
        >
          + Add Customer
        </button>
      </div>

      {/* Search */}
      <div className="customer-toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Search by name, mobile, business or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <span className="customer-count">
          {filteredCustomers.length} customers
        </span>
      </div>

      {/* Error */}
      {error && !showForm && (
        <div className="page-error">{error}</div>
      )}

      {/* Customer list */}
      <div className="customers-card">
        {loading ? (
          <div className="page-loading">
            Loading customers...
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="customer-empty">
            <div className="empty-icon">♙</div>

            <h3>
              {search
                ? "No customers found"
                : "No customers yet"}
            </h3>

            <p>
              {search
                ? "Try a different search."
                : "Add your first customer to get started."}
            </p>

            {!search && (
              <button
                className="primary-button"
                onClick={openAddForm}
              >
                + Add Customer
              </button>
            )}
          </div>
        ) : (
          <div className="customer-list">
            {filteredCustomers.map((customer) => (
              <div
                className="customer-row"
                key={customer.id}
              >
                <div className="customer-avatar">
                  {customer.name
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="customer-main">
                  <strong>{customer.name}</strong>

                  <span>
                    {customer.businessName ||
                      customer.mobile}
                  </span>
                </div>

                <div className="customer-contact">
                  <strong>{customer.mobile}</strong>
                  <span>
                    {customer.email || "No email"}
                  </span>
                </div>

                <span className="type-badge">
                  {customer.customerType}
                </span>

                <span
                  className={`status-badge ${customer.status.toLowerCase()}`}
                >
                  {customer.status}
                </span>

                <div className="customer-actions">
                  <button
                    onClick={() =>
                      navigate(
                        `/customers/${customer.id}`
                      )
                    }
                    title="View"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      openEditForm(customer)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-action"
                    onClick={() =>
                      handleDelete(customer.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
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
                  CUSTOMER
                </p>

                <h2>
                  {editingId
                    ? "Edit Customer"
                    : "Add Customer"}
                </h2>
              </div>

              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
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
                    placeholder="Customer name"
                  />
                </div>

                <div className="form-field">
                  <label>Mobile *</label>

                  <input
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    required
                    placeholder="9876543210"
                  />
                </div>

                <div className="form-field">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="customer@example.com"
                  />
                </div>

                <div className="form-field">
                  <label>Business Name</label>

                  <input
                    name="businessName"
                    value={form.businessName}
                    onChange={handleChange}
                    placeholder="Business name"
                  />
                </div>

                <div className="form-field">
                  <label>GST Number</label>

                  <input
                    name="gstNumber"
                    value={form.gstNumber}
                    onChange={handleChange}
                    placeholder="GST number"
                  />
                </div>

                <div className="form-field">
                  <label>Customer Type *</label>

                  <select
                    name="customerType"
                    value={form.customerType}
                    onChange={handleChange}
                    required
                  >
                    <option value="RETAIL">
                      Retail
                    </option>
                    <option value="WHOLESALE">
                      Wholesale
                    </option>
                    <option value="DISTRIBUTOR">
                      Distributor
                    </option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Status</label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="LEAD">Lead</option>
                    <option value="ACTIVE">
                      Active
                    </option>
                    <option value="INACTIVE">
                      Inactive
                    </option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Follow-up Date</label>

                  <input
                    type="date"
                    name="followUpDate"
                    value={form.followUpDate}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-field full">
                  <label>Address *</label>

                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    placeholder="Customer address"
                  />
                </div>

                <div className="form-field full">
                  <label>Notes</label>

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Additional notes..."
                    rows={3}
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
                    ? "Update Customer"
                    : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}