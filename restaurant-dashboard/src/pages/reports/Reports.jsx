import { useMemo, useState } from "react";
import {
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import { formatCurrency } from "../../lib/format";
import { EmptyState } from "../../components/ui/States";

export default function Reports() {
  const { orders, products, settings, stats } = useAppData();
  const [range, setRange] = useState("week");

  const completedOrders = useMemo(
    () => orders.filter((o) => o.status === "Completed"),
    [orders]
  );

  const salesData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const buckets = Object.fromEntries(days.map((d) => [d, 0]));

    completedOrders.forEach((order) => {
      const date = new Date(order.createdAt || 0);
      const key = days[date.getDay()];
      buckets[key] += Number(order.total || 0);
    });

    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      day,
      sales: buckets[day] || 0,
    }));
  }, [completedOrders]);

  const bestSellers = useMemo(() => {
    const map = new Map();

    completedOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        if (typeof item === "string") return;
        const prev = map.get(item.name) || { name: item.name, sold: 0, revenue: 0 };
        prev.sold += item.quantity || 1;
        prev.revenue += (item.price || 0) * (item.quantity || 1);
        map.set(item.name, prev);
      });
    });

    const list = Array.from(map.values()).sort((a, b) => b.sold - a.sold);
    if (list.length) return list.slice(0, 8);

    // Fallback from products when orders lack item lines
    return products
      .slice(0, 4)
      .map((p) => ({ name: p.name, sold: 0, revenue: 0 }));
  }, [completedOrders, products]);

  const maxSales = Math.max(...salesData.map((item) => item.sales), 1);
  const avgOrder =
    completedOrders.length > 0
      ? stats.revenue / completedOrders.length
      : 0;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Reports & Analytics
        </h1>
        <p className="mt-1 text-gray-500">
          Track your restaurant performance from live order data
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { id: "week", label: "This Week" },
          { id: "month", label: "This Month" },
          { id: "year", label: "This Year" },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setRange(item.id)}
            className={`rounded-lg px-5 py-3 text-sm font-medium ${
              range === item.id
                ? "bg-yellow-500 text-white"
                : "bg-white shadow-sm hover:bg-gray-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h2 className="mt-2 text-2xl font-bold">
                {formatCurrency(stats.revenue, settings.currency)}
              </h2>
            </div>
            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              <DollarSign size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h2 className="mt-2 text-2xl font-bold">{stats.totalOrders}</h2>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <ShoppingCart size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Average Order</p>
              <h2 className="mt-2 text-2xl font-bold">
                {formatCurrency(avgOrder, settings.currency)}
              </h2>
            </div>
            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Products</p>
              <h2 className="mt-2 text-2xl font-bold">{stats.products}</h2>
            </div>
            <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
              <Package size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">Weekly Sales</h2>
          <p className="text-sm text-gray-500">
            Based on completed orders stored in the app
          </p>
        </div>

        <div className="flex h-64 items-end justify-between gap-3 sm:h-72 sm:gap-4">
          {salesData.map((item) => {
            const height = (item.sales / maxSales) * 100;
            return (
              <div
                key={item.day}
                className="flex h-full flex-1 flex-col items-center justify-end gap-2"
              >
                <div className="text-[10px] font-medium sm:text-xs">
                  {item.sales > 0 ? Math.round(item.sales) : 0}
                </div>
                <div
                  className="w-full rounded-t-lg bg-yellow-500 transition hover:bg-yellow-600"
                  style={{ height: `${Math.max(height, 4)}%` }}
                />
                <span className="text-xs text-gray-500 sm:text-sm">
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 p-6">
          <h2 className="text-xl font-bold">Best Selling Products</h2>
          <p className="mt-1 text-sm text-gray-500">
            Calculated from completed order line items
          </p>
        </div>

        {bestSellers.every((p) => p.sold === 0) ? (
          <EmptyState
            title="Not enough sales data yet"
            description="Complete POS checkouts to populate this report."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    Product
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    Units Sold
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {bestSellers.map((product) => (
                  <tr key={product.name} className="border-t border-gray-50">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4">{product.sold}</td>
                    <td className="p-4 font-semibold">
                      {formatCurrency(product.revenue, settings.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
