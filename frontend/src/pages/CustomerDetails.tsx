import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

interface Customer {
  id: number;
  name: string;
  mobile: string;
  email?: string;
  businessName?: string;
  gstNumber?: string;
  customerType: string;
  address: string;
  status: string;
  followUpDate?: string;
  notes?: string;
  createdAt: string;
}

export default function CustomerDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const response = await api.get(`/customers/${id}`);

        setCustomer(
          response.data.customer || response.data
        );
      } catch (err) {
        console.error(err);
        setError("Failed to load customer");
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  if (loading) {
    return (
      <div className="details-loading">
        Loading customer...
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div>
        <button
          className="back-button"
          onClick={() => navigate("/customers")}
        >
          ← Back to Customers
        </button>

        <div className="page-error">
          {error || "Customer not found"}
        </div>
      </div>
    );
  }

  return (
    <div>
      <button
        className="back-button"
        onClick={() => navigate("/customers")}
      >
        ← Back to Customers
      </button>

      <div className="details-header">
        <div className="customer-large-avatar">
          {customer.name.charAt(0).toUpperCase()}
        </div>

        <div>
          <p className="eyebrow">CUSTOMER PROFILE</p>

          <h1>{customer.name}</h1>

          <p className="page-subtitle">
            {customer.businessName ||
              "Individual Customer"}
          </p>
        </div>

        <div className="details-status">
          <span className="status-badge">
            {customer.status}
          </span>
        </div>
      </div>

      <div className="details-grid">
        <div className="details-card">
          <h3>Contact Information</h3>

          <div className="detail-item">
            <span>Mobile</span>
            <strong>{customer.mobile}</strong>
          </div>

          <div className="detail-item">
            <span>Email</span>
            <strong>
              {customer.email || "Not provided"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Address</span>
            <strong>{customer.address}</strong>
          </div>
        </div>

        <div className="details-card">
          <h3>Business Information</h3>

          <div className="detail-item">
            <span>Business Name</span>
            <strong>
              {customer.businessName ||
                "Not provided"}
            </strong>
          </div>

          <div className="detail-item">
            <span>Customer Type</span>
            <strong>
              {customer.customerType}
            </strong>
          </div>

          <div className="detail-item">
            <span>GST Number</span>
            <strong>
              {customer.gstNumber ||
                "Not provided"}
            </strong>
          </div>
        </div>
      </div>

      <div className="details-card details-wide">
        <h3>Customer Notes</h3>

        <p className="notes">
          {customer.notes ||
            "No notes added for this customer."}
        </p>
      </div>

      <div className="details-card details-wide">
        <h3>Customer Timeline</h3>

        <div className="timeline-item">
          <div className="timeline-dot" />

          <div>
            <strong>Customer Created</strong>

            <p>
              {new Date(
                customer.createdAt
              ).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}