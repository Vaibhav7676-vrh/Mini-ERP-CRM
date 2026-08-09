import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  return (
    <header className="navbar">
      <div>
        <span className="navbar-title">Business Management</span>
      </div>

      <div className="navbar-user">
        <div className="notification">♢</div>

        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase() || "A"}
        </div>

        <div className="user-info">
          <strong>{user?.name || "Admin"}</strong>
          <span>{user?.role || "ADMIN"}</span>
        </div>
      </div>
    </header>
  );
}