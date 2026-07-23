export default function OrderDetailsModal({
  isOpen,
  onClose,
  order,
}) {
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">

          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Order Details
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {order.id}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-800"
          >
            ×
          </button>

        </div>

        {/* Details */}
        <div className="space-y-5 p-6">

          {/* Customer Information */}
          <div className="rounded-xl bg-gray-50 p-4">

            <h3 className="mb-3 font-bold text-gray-800">
              Customer Information
            </h3>

            <div className="flex justify-between">

              <span className="text-gray-500">
                Customer
              </span>

              <span className="font-medium">
                {order.customer}
              </span>

            </div>

            <div className="mt-2 flex justify-between">

              <span className="text-gray-500">
                Order Date
              </span>

              <span className="font-medium">
                {order.date}
              </span>

            </div>

          </div>

          {/* Order Items */}
          <div>

            <h3 className="mb-3 font-bold text-gray-800">
              Order Items
            </h3>

            <div className="rounded-xl border p-4">
              {Array.isArray(order.items) ? (
                <ul className="space-y-2">
                  {order.items.map((item, index) => (
                    <li
                      key={`${item.name}-${index}`}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-semibold">
                        Rs. {item.price * item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex justify-between">
                  <span>{order.itemsLabel || order.items}</span>
                  <span className="font-semibold">Rs. {order.total}</span>
                </div>
              )}
            </div>

          </div>

          {/* Payment */}
          <div className="rounded-xl bg-gray-50 p-4">

            <h3 className="mb-3 font-bold text-gray-800">
              Payment Information
            </h3>

            <div className="flex justify-between">

              <span className="text-gray-500">
                Payment Method
              </span>

              <span className="font-medium">
                {order.payment}
              </span>

            </div>

            <div className="mt-3 flex justify-between">

              <span className="text-gray-500">
                Status
              </span>

              <span
                className={`rounded-full px-3 py-1 text-sm ${
                  order.status === "Completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {order.status}
              </span>

            </div>

          </div>

          {/* Total */}
          <div className="flex justify-between border-t pt-5 text-xl font-bold">

            <span>
              Total
            </span>

            <span>
              Rs. {order.total}
            </span>

          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end border-t p-6">

          <button
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