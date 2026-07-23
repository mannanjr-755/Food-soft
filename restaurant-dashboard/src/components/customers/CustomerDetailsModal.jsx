import { useMemo } from "react";
import { formatCurrency } from "../../lib/format";
import { EmptyState } from "../ui/States";

export default function CustomerDetailsModal({
  isOpen,
  onClose,
  customer,
  orders = [],
  currency = "PKR",
}) {
  const history = useMemo(() => {
    if (!customer) return [];
    return orders.filter(
      (o) =>
        (customer.id && o.customerId === customer.id) ||
        (o.customer || "").toLowerCase() === customer.name.toLowerCase()
    );
  }, [orders, customer]);

  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-details-title"
        className="w-full max-w-2xl rounded-2xl bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-xl font-bold text-yellow-700">
              {customer.name.charAt(0)}
            </div>
            <div>
              <h2
                id="customer-details-title"
                className="text-2xl font-bold text-gray-800"
              >
                {customer.name}
              </h2>
              <p className="text-gray-500">Customer Details</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-800"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <h3 className="mb-3 text-lg font-bold">Contact Information</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Phone</p>
                <p className="mt-1 font-semibold">{customer.phone || "—"}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Email</p>
                <p className="mt-1 font-semibold">{customer.email || "—"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-bold">Customer Statistics</h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="mt-2 text-2xl font-bold">
                  {customer.totalOrders}
                </p>
              </div>
              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="mt-2 text-2xl font-bold">
                  {formatCurrency(customer.totalSpent, currency)}
                </p>
              </div>
              <div className="rounded-xl bg-yellow-50 p-4">
                <p className="text-sm text-gray-500">Last Order</p>
                <p className="mt-2 font-bold">{customer.lastOrder}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-bold">Order History</h3>
            <div className="rounded-xl border">
              {history.length === 0 ? (
                <EmptyState
                  title="No orders yet"
                  description="Orders for this customer will appear here."
                />
              ) : (
                history.map((order, index) => (
                  <div
                    key={order.id}
                    className={`flex items-center justify-between p-4 ${
                      index < history.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div>
                      <p className="font-semibold">{order.id}</p>
                      <p className="text-sm text-gray-500">
                        {order.itemsLabel ||
                          order.items
                            ?.map((i) => i.name)
                            .filter(Boolean)
                            .join(", ") ||
                          "—"}
                      </p>
                    </div>
                    <span className="font-bold">
                      {formatCurrency(order.total, currency)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t p-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-gray-800 px-6 py-3 text-white hover:bg-gray-900"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
