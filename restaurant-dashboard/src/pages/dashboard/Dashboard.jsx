import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  DollarSign,
  Eye,
  Package,
  Plus,
  Printer,
  ShoppingCart,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../../components/dashboard/StatCard";
import InvoiceReceipt from "../../components/invoice/InvoiceReceipt";
import { useAppData } from "../../context/AppDataContext";
import { formatCurrency, isSameDay } from "../../lib/format";
import { EmptyState } from "../../components/ui/States";

const statusColor = {
  Completed: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
};

const paymentColor = {
  PAID: "bg-green-100 text-green-700",
  UNPAID: "bg-red-100 text-red-700",
  PARTIALLY_PAID: "bg-amber-100 text-amber-800",
  REFUNDED: "bg-gray-100 text-gray-600",
};

export default function Dashboard() {
  const { stats, orders, products, settings, customers } = useAppData();
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  const recentOrders = orders.slice(0, 6);
  const lowStock = products
    .filter(
      (p) =>
        p.stockStatus === "Low Stock" || p.stockStatus === "Out of Stock"
    )
    .slice(0, 5);

  const weekSales = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const buckets = Object.fromEntries(days.map((d) => [d, 0]));
    orders.forEach((order) => {
      if (order.status === "Cancelled") return;
      const date = new Date(order.createdAt || 0);
      const map = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const key = map[date.getDay()];
      if (buckets[key] !== undefined) {
        buckets[key] += Number(order.total || 0);
      }
    });
    return days.map((day) => ({ day, sales: buckets[day] || 0 }));
  }, [orders]);

  const maxSales = Math.max(...weekSales.map((d) => d.sales), 1);

  const topProducts = useMemo(() => {
    const map = new Map();
    orders.forEach((order) => {
      if (order.status === "Cancelled") return;
      (order.items || []).forEach((item) => {
        if (!item?.name) return;
        const prev = map.get(item.name) || {
          name: item.name,
          sold: 0,
          revenue: 0,
        };
        prev.sold += item.quantity || 1;
        prev.revenue += (item.price || 0) * (item.quantity || 1);
        map.set(item.name, prev);
      });
    });
    return Array.from(map.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [orders]);

  const todayLabel = new Date().toLocaleDateString("en-PK", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const todayOrderCount = orders.filter((o) => isSameDay(o.createdAt)).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-yellow-700">{todayLabel}</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">
            Business Overview
          </h1>
          <p className="mt-1 text-gray-500">
            Live performance for {settings.restaurantName}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/pos"
            className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-yellow-600"
          >
            <Plus size={16} />
            New Sale
          </Link>
          <Link
            to="/products"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Add Product
          </Link>
          <Link
            to="/customers"
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Add Customer
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={formatCurrency(stats.revenue, settings.currency)}
          icon={<DollarSign className="text-white" size={22} />}
          color="bg-emerald-500"
          hint={`${stats.completedOrders} paid/completed`}
        />
        <StatCard
          title="Today's Sales"
          value={formatCurrency(stats.todaySales, settings.currency)}
          icon={<ShoppingCart className="text-white" size={22} />}
          color="bg-blue-500"
          hint={`${todayOrderCount} orders today`}
        />
        <StatCard
          title="Pending Orders"
          value={String(stats.pendingOrders)}
          icon={<Package className="text-white" size={22} />}
          color="bg-amber-500"
          hint={`${stats.totalOrders} total orders`}
        />
        <StatCard
          title="Outstanding"
          value={formatCurrency(stats.outstanding, settings.currency)}
          icon={<AlertTriangle className="text-white" size={22} />}
          color="bg-rose-500"
          hint="Unpaid / partial balances"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-yellow-50 p-2.5 text-yellow-700">
              <Users size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Customers</p>
              <p className="text-xl font-bold">{stats.customers}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
              <UtensilsCrossed size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Products</p>
              <p className="text-xl font-bold">{stats.products}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-green-50 p-2.5 text-green-700">
              <DollarSign size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Paid Amount</p>
              <p className="text-lg font-bold">
                {formatCurrency(stats.paidAmount, settings.currency)}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-red-50 p-2.5 text-red-700">
              <Package size={18} />
            </div>
            <div>
              <p className="text-xs text-gray-500">Low / Out Stock</p>
              <p className="text-xl font-bold">
                {stats.lowStock + stats.outOfStock}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Sales Analytics</h2>
              <p className="text-sm text-gray-500">Weekly revenue from orders</p>
            </div>
            <Link
              to="/reports"
              className="inline-flex items-center gap-1 text-sm font-medium text-yellow-700 hover:underline"
            >
              Full reports <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="flex h-56 items-end justify-between gap-3 sm:h-64">
            {weekSales.map((item) => (
              <div
                key={item.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <span className="text-[10px] font-medium text-gray-500 sm:text-xs">
                  {item.sales ? Math.round(item.sales) : 0}
                </span>
                <div
                  className="w-full rounded-t-lg bg-yellow-500/90"
                  style={{
                    height: `${Math.max((item.sales / maxSales) * 100, 4)}%`,
                  }}
                />
                <span className="text-xs text-gray-500">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-gray-900">
            Top Products
          </h2>
          {topProducts.length === 0 ? (
            <EmptyState
              title="No sales data"
              description="Complete POS sales to populate rankings."
            />
          ) : (
            <ul className="space-y-3">
              {topProducts.map((product, index) => (
                <li
                  key={product.name}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-xs font-bold text-gray-600 shadow-sm">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-gray-500">
                        {product.sold} sold
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold">
                    {formatCurrency(product.revenue, settings.currency)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Recent Orders</h2>
            <Link
              to="/orders"
              className="text-sm font-medium text-yellow-700 hover:underline"
            >
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              description="Create an order from POS."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-3 font-medium">Order</th>
                    <th className="pb-3 font-medium">Customer</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Payment</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50">
                      <td className="py-3 font-semibold">
                        {order.id}
                        <p className="text-xs font-normal text-gray-500">
                          {order.date}
                        </p>
                      </td>
                      <td className="py-3">{order.customer}</td>
                      <td className="py-3">
                        {formatCurrency(order.total, settings.currency)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${
                            paymentColor[order.paymentStatus] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.paymentStatus || "PAID"}
                        </span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs ${
                            statusColor[order.status] || "bg-gray-100"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setInvoiceOrder(order)}
                            className="rounded-lg bg-slate-800 p-2 text-white hover:bg-slate-900"
                            title="View / Print invoice"
                          >
                            <Printer size={14} />
                          </button>
                          <Link
                            to="/orders"
                            className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                            title="Orders"
                          >
                            <Eye size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="mb-3 font-bold text-gray-900">Quick Actions</h2>
            <div className="grid gap-2">
              {[
                { to: "/pos", label: "New Sale" },
                { to: "/orders", label: "View Orders" },
                { to: "/menu", label: "Manage Menu" },
                { to: "/reports", label: "View Reports" },
                { to: "/settings", label: "Settings" },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="rounded-xl border border-gray-100 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-yellow-200 hover:bg-yellow-50"
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-2">
              <AlertTriangle size={18} className="text-red-500" />
              <h2 className="font-bold text-gray-900">Stock Alerts</h2>
            </div>
            {lowStock.length === 0 ? (
              <p className="text-sm text-gray-500">All stock levels look good.</p>
            ) : (
              <ul className="space-y-2">
                {lowStock.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>{p.name}</span>
                    <span
                      className={
                        p.stock === 0 ? "text-red-600" : "text-yellow-700"
                      }
                    >
                      {p.stock} left
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-4 text-xs text-gray-400">
              Top customer: {customers[0]?.name || "—"}
            </p>
          </div>
        </div>
      </div>

      {invoiceOrder ? (
        <div className="print-root fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold">Invoice Preview</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  <Printer size={16} />
                  Print
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceOrder(null)}
                  className="rounded-lg border px-4 py-2 text-sm"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="print-area mx-auto w-fit overflow-auto rounded-lg border border-gray-200 bg-white">
              <InvoiceReceipt order={invoiceOrder} settings={settings} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
