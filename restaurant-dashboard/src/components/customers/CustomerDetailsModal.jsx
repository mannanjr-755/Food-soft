export default function CustomerDetailsModal({
  isOpen,
  onClose,
  customer,
}) {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-4">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-100 text-xl font-bold text-yellow-700">
              {customer.name.charAt(0)}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {customer.name}
              </h2>

              <p className="text-gray-500">
                Customer Details
              </p>
            </div>

          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-800"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">

          {/* Contact Information */}
          <div>
            <h3 className="mb-3 text-lg font-bold">
              Contact Information
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p className="mt-1 font-semibold">
                  {customer.phone}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="mt-1 font-semibold">
                  {customer.email}
                </p>
              </div>

            </div>
          </div>

          {/* Statistics */}
          <div>
            <h3 className="mb-3 text-lg font-bold">
              Customer Statistics
            </h3>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

              <div className="rounded-xl bg-blue-50 p-4">
                <p className="text-sm text-gray-500">
                  Total Orders
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {customer.totalOrders}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 p-4">
                <p className="text-sm text-gray-500">
                  Total Spent
                </p>

                <p className="mt-2 text-2xl font-bold">
                  Rs. {customer.totalSpent}
                </p>
              </div>

              <div className="rounded-xl bg-yellow-50 p-4">
                <p className="text-sm text-gray-500">
                  Last Order
                </p>

                <p className="mt-2 font-bold">
                  {customer.lastOrder}
                </p>
              </div>

            </div>
          </div>

          {/* Order History */}
          <div>
            <h3 className="mb-3 text-lg font-bold">
              Order History
            </h3>

            <div className="rounded-xl border">

              <div className="flex items-center justify-between border-b p-4">
                <div>
                  <p className="font-semibold">
                    #ORD-1001
                  </p>

                  <p className="text-sm text-gray-500">
                    Zinger Burger, Pepsi
                  </p>
                </div>

                <span className="font-bold">
                  Rs. 670
                </span>
              </div>

              <div className="flex items-center justify-between p-4">
                <div>
                  <p className="font-semibold">
                    #ORD-0995
                  </p>

                  <p className="text-sm text-gray-500">
                    Chicken Pizza
                  </p>
                </div>

                <span className="font-bold">
                  Rs. 1200
                </span>
              </div>

            </div>
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