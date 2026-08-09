import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout } = useAuth();

  const links = [
    { name: "Dashboard", path: "/dashboard", icon: "⌂" },
    { name: "Customers", path: "/customers", icon: "♙" },
    { name: "Products", path: "/products", icon: "▣" },
    { name: "Inventory", path: "/inventory", icon: "▤" },
    { name: "Challans", path: "/challans", icon: "▧" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">M</div>

        <div>
          <h2>Mini ERP</h2>
          <span>CRM & Operations</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <p className="nav-label">MENU</p>

        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `nav-link ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <button onClick={logout} className="logout-button">
          <span>↪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}