import { Bell, Menu, UserCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";

export default function Navbar({ title, onMenuClick }) {
  const { user } = useAuth();
  const { stats, settings } = useAppData();

  const today = new Date().toLocaleDateString("en-PK", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gray-100 bg-white px-4 shadow-sm sm:h-20 sm:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <div>
          <h2 className="text-lg font-semibold text-gray-900 sm:text-2xl">
            {title}
          </h2>
          <p className="hidden text-xs text-gray-500 sm:block">
            {today}
            {" · "}
            {settings.isOpen ? "Open" : "Closed"}
            {stats.pendingOrders
              ? ` · ${stats.pendingOrders} pending`
              : ""}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <Link
          to="/pos"
          className="hidden rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-600 sm:inline-flex"
        >
          New Sale
        </Link>

        <button
          type="button"
          className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
          aria-label="Notifications"
        >
          <Bell size={20} />
          {stats.pendingOrders > 0 ? (
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
          ) : null}
        </button>

        <div className="hidden items-center gap-2 sm:flex">
          <UserCircle size={32} className="text-gray-500" />
          <div className="leading-tight">
            <p className="text-sm font-medium text-gray-800">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
