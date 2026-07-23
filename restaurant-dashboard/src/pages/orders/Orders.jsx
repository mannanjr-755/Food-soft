import { useMemo, useState } from "react";
import {
  CheckCircle,
  Eye,
  Printer,
  Trash2,
  XCircle,
} from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import { formatCurrency } from "../../lib/format";
import InvoiceReceipt from "../../components/invoice/InvoiceReceipt";
import OrderDetailsModal from "../../components/orders/OrderDetailsModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import SearchInput from "../../components/ui/SearchInput";
import { EmptyState } from "../../components/ui/States";

export default function Orders() {
  const {
    orders,
    settings,
    updateOrderStatus,
    updatePaymentStatus,
    deleteOrder,
  } = useAppData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => {
    return orders.filter((order) => {
      const q = search.toLowerCase();
      const matchesSearch =
        order.customer.toLowerCase().includes(q) ||
        order.id.toLowerCase().includes(q) ||
        (order.invoiceNumber || "").toLowerCase().includes(q);
      const matchesStatus =
        statusFilter === "All" || order.status === statusFilter;
      const matchesPayment =
        paymentFilter === "All" ||
        (order.paymentStatus || "PAID") === paymentFilter;
      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [orders, search, statusFilter, paymentFilter]);

  const openInvoice = (order) => {
    setInvoiceOrder(order);
    window.setTimeout(() => window.print(), 300);
  };

  return (
    <div>
      <div className="mb-6 no-print">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">Orders</h1>
        <p className="text-gray-500">
          Search, update status, and print invoices
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 no-print">
        {["All", "Pending", "Completed", "Cancelled"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              statusFilter === status
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-700 shadow-sm"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="mb-4 flex flex-wrap gap-2 no-print">
        {["All", "PAID", "UNPAID", "PARTIALLY_PAID"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setPaymentFilter(status)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
              paymentFilter === status
                ? "bg-slate-800 text-white"
                : "bg-white text-gray-600 ring-1 ring-gray-200"
            }`}
          >
            {status === "All" ? "All Payments" : status.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="no-print">
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search order, invoice or customer..."
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm no-print">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Order / Invoice
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Customer
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Items
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Total
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Payment
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="p-4 text-center text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="border-t border-gray-50 hover:bg-gray-50"
                >
                  <td className="p-4 font-semibold">
                    {order.id}
                    <p className="mt-1 text-xs font-normal text-gray-500">
                      {order.invoiceNumber || "—"} · {order.date}
                    </p>
                  </td>
                  <td className="p-4">
                    {order.customer}
                    {order.phone ? (
                      <p className="text-xs text-gray-500">{order.phone}</p>
                    ) : null}
                  </td>
                  <td className="p-4 text-gray-600">
                    {order.itemsLabel ||
                      order.items?.map((i) => i.name).join(", ")}
                  </td>
                  <td className="p-4 font-semibold">
                    {formatCurrency(order.total, settings.currency)}
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{order.payment}</p>
                    <span
                      className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs ${
                        order.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-700"
                          : order.paymentStatus === "UNPAID"
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {order.paymentStatus || "PAID"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        order.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : order.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(order);
                          setDetailsOpen(true);
                        }}
                        className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                        title="View"
                        aria-label={`View order ${order.id}`}
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => openInvoice(order)}
                        className="rounded-lg bg-slate-800 p-2 text-white hover:bg-slate-900"
                        title="Print Invoice"
                        aria-label={`Print invoice ${order.id}`}
                      >
                        <Printer size={18} />
                      </button>
                      {order.status === "Pending" ? (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              updateOrderStatus(order.id, "Completed");
                              updatePaymentStatus(order.id, "PAID", order.total);
                            }}
                            className="rounded-lg bg-green-500 p-2 text-white hover:bg-green-600"
                            title="Complete & Mark Paid"
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              updateOrderStatus(order.id, "Cancelled")
                            }
                            className="rounded-lg bg-orange-500 p-2 text-white hover:bg-orange-600"
                            title="Cancel"
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      ) : null}
                      {order.paymentStatus === "UNPAID" ? (
                        <button
                          type="button"
                          onClick={() =>
                            updatePaymentStatus(order.id, "PAID", order.total)
                          }
                          className="rounded-lg bg-emerald-600 px-2 py-1 text-xs font-medium text-white"
                        >
                          Mark Paid
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => setDeleteId(order.id)}
                        className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No orders found" />
        ) : null}
      </div>

      <OrderDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        order={selected}
      />

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete order?"
        message="This order and its invoice reference will be permanently removed."
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteOrder(deleteId)}
      />

      {invoiceOrder ? (
        <div className="print-root fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-lg font-bold">Invoice</h3>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  <Printer size={16} />
                  Print Again
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
