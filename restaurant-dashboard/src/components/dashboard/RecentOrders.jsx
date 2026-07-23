const orders = [
  {
    id: "#1001",
    customer: "Ali Khan",
    items: "Zinger Burger x2",
    amount: "Rs. 1,250",
    status: "Completed",
    time: "10:30 AM",
  },
  {
    id: "#1002",
    customer: "Ahmed Raza",
    items: "Pizza Large",
    amount: "Rs. 2,100",
    status: "Pending",
    time: "11:15 AM",
  },
  {
    id: "#1003",
    customer: "Usman",
    items: "Broast Deal",
    amount: "Rs. 950",
    status: "Cancelled",
    time: "12:00 PM",
  },
];

const statusColor = {
  Completed: "bg-green-100 text-green-600",
  Pending: "bg-yellow-100 text-yellow-600",
  Cancelled: "bg-red-100 text-red-600",
};

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border p-6 mt-8">

      <h2 className="text-xl font-bold mb-6">
        Recent Orders
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b">

            <th className="text-left py-3">Order ID</th>

            <th className="text-left">Customer</th>

            <th className="text-left">Items</th>

            <th className="text-left">Amount</th>

            <th className="text-left">Status</th>

            <th className="text-left">Time</th>

          </tr>

        </thead>

        <tbody>

          {orders.map((order) => (

            <tr
              key={order.id}
              className="border-b hover:bg-gray-50"
            >

              <td className="py-4">{order.id}</td>

              <td>{order.customer}</td>

              <td>{order.items}</td>

              <td>{order.amount}</td>

              <td>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${statusColor[order.status]}`}
                >
                  {order.status}
                </span>

              </td>

              <td>{order.time}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}