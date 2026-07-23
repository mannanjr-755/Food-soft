import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const titles = {
  "/admin/dashboard": "Dashboard",
  "/dashboard": "Dashboard",
  "/orders": "Orders",
  "/menu": "Menu",
  "/products": "Products",
  "/categories": "Categories",
  "/customers": "Customers",
  "/inventory": "Inventory",
  "/staff": "Staff",
  "/pos": "Point of Sale",
  "/reports": "Reports",
  "/settings": "Settings",
};

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = titles[location.pathname] || "Admin";
  const isPOS = location.pathname === "/pos";

  return (
    <div className="min-h-screen bg-slate-50">
      {sidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden no-print"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="no-print">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <div className={`flex min-h-screen flex-col lg:ml-64`}>
        <div className="no-print">
          <Navbar
            title={title}
            onMenuClick={() => setSidebarOpen(true)}
          />
        </div>
        <main className={`flex-1 ${isPOS ? "p-3 sm:p-4" : "p-4 sm:p-6"}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
