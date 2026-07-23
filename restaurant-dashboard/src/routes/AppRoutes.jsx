import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute, {
  PublicOnlyRoute,
} from "../components/auth/ProtectedRoute";
import Layout from "../components/layout/Layout";
import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Orders from "../pages/orders/Orders";
import Menu from "../pages/menu/Menu";
import Products from "../pages/products/Products";
import Categories from "../pages/categories/Categories";
import Customers from "../components/customers/Customers";
import Inventory from "../pages/inventory/Inventory";
import Staff from "../pages/staff/Staff";
import POS from "../pages/pos/POS";
import Reports from "../pages/reports/Reports";
import Settings from "../pages/settings/Settings";

export default function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/admin/login"
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/products" element={<Products />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}
