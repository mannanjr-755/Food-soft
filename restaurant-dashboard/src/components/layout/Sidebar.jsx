import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingCart,
  UtensilsCrossed,
  FolderTree,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Package,
  UserCog,
  Monitor,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";

const menu = [
  { name: "Dashboard", icon: LayoutDashboard, to: "/admin/dashboard" },
  { name: "POS / New Sale", icon: Monitor, to: "/pos" },
  { name: "Orders", icon: ShoppingCart, to: "/orders" },
  { name: "Menu", icon: UtensilsCrossed, to: "/menu" },
  { name: "Products", icon: Package, to: "/products" },
  { name: "Categories", icon: FolderTree, to: "/categories" },
  { name: "Inventory", icon: Package, to: "/inventory" },
  { name: "Customers", icon: Users, to: "/customers" },
  { name: "Staff", icon: UserCog, to: "/staff", adminOnly: true },
  { name: "Reports", icon: BarChart3, to: "/reports" },
  { name: "Settings", icon: Settings, to: "/settings" },
];

export default function Sidebar({ open, onClose }) {
  const { logout, isAdmin, user } = useAuth();
  const { settings } = useAppData();
  const navigate = useNavigate();

  const items = menu.filter((item) => !item.adminOnly || isAdmin);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-100 bg-white shadow-lg transition-transform duration-200 ${
        open ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex h-20 items-center justify-between border-b border-gray-100 px-5">
        <div>
          <h1 className="text-xl font-bold text-yellow-500">
            {settings.restaurantName || "Restaurant"}
          </h1>
          <p className="text-xs text-gray-400">Admin Panel</p>
        </div>
        <button
          type="button"
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          onClick={onClose}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              `mx-3 mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-yellow-50 text-yellow-700"
                  : "text-gray-700 hover:bg-yellow-50/70"
              }`
            }
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-gray-100 p-4">
        <div className="mb-3 rounded-xl bg-slate-50 px-3 py-2">
          <p className="truncate text-sm font-semibold text-gray-800">
            {user?.name}
          </p>
          <p className="text-xs text-gray-500">{user?.role}</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-red-600 hover:bg-red-50"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
}
