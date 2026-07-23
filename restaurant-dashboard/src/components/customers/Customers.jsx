import { useMemo, useState } from "react";
import { Eye, Mail, Phone, Plus, Trash2 } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import { formatCurrency } from "../../lib/format";
import CustomerDetailsModal from "./CustomerDetailsModal";
import ConfirmModal from "../ui/ConfirmModal";
import SearchInput from "../ui/SearchInput";
import { EmptyState } from "../ui/States";

function CustomerFormModal({ isOpen, onClose, onSave, initial }) {
  const [form, setForm] = useState(
    initial || { name: "", phone: "", email: "" }
  );

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      return;
    }
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="border-b p-6">
          <h2 className="text-xl font-bold">
            {initial?.id ? "Edit Customer" : "Add Customer"}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          <input
            className="w-full rounded-lg border p-3"
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            className="w-full rounded-lg border p-3"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            className="w-full rounded-lg border p-3"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-yellow-500 px-4 py-2 text-white"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Customers() {
  const {
    customers,
    orders,
    settings,
    addCustomer,
    updateCustomer,
    deleteCustomer,
  } = useAppData();

  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q)
    );
  }, [customers, search]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Customers
          </h1>
          <p className="mt-1 text-gray-500">
            Manage your restaurant customers
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-white hover:bg-yellow-600"
        >
          <Plus size={20} />
          Add Customer
        </button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search customer by name, phone or email..."
      />

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Customer
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Contact
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Total Orders
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Total Spent
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Last Order
                </th>
                <th className="p-4 text-center text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-t border-gray-50 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 font-bold text-yellow-700">
                        {customer.name.charAt(0)}
                      </div>
                      <span className="font-semibold">{customer.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Phone size={14} />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Mail size={14} />
                        {customer.email || "—"}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-semibold">{customer.totalOrders}</td>
                  <td className="p-4 font-semibold">
                    {formatCurrency(customer.totalSpent, settings.currency)}
                  </td>
                  <td className="p-4 text-gray-600">{customer.lastOrder}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                        onClick={() => {
                          setSelected(customer);
                          setDetailsOpen(true);
                        }}
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        type="button"
                        className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                        onClick={() => setDeleteId(customer.id)}
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
          <EmptyState title="No customers found." />
        ) : null}
      </div>

      <CustomerDetailsModal
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        customer={selected}
        orders={orders}
        currency={settings.currency}
      />

      <CustomerFormModal
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        initial={editing}
        onSave={(data) => {
          if (editing?.id) updateCustomer({ ...editing, ...data });
          else addCustomer(data);
        }}
      />

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete customer?"
        message="This customer record will be removed."
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteCustomer(deleteId)}
      />
    </div>
  );
}
