import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Search, UserPlus, X } from "lucide-react";
import { formatCurrency } from "../../lib/format";

export default function CheckoutModal({
  isOpen,
  onClose,
  onConfirm,
  cart,
  customers,
  settings,
  subtotal,
  tax,
  discount,
  total,
  onDiscountChange,
  onAddCustomer,
}) {
  const [step, setStep] = useState(1);
  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [walkIn, setWalkIn] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paidAmount, setPaidAmount] = useState("");
  const [paidTouched, setPaidTouched] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickCustomer, setQuickCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const resolvedPaid = paidTouched ? paidAmount : total;

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape" && !submitting) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose, submitting]);

  const filteredCustomers = useMemo(() => {
    const q = customerQuery.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.phone || "").includes(q) ||
        (c.email || "").toLowerCase().includes(q)
    );
  }, [customers, customerQuery]);

  if (!isOpen) return null;

  const remaining = Math.max(0, total - Number(resolvedPaid || 0));
  const paymentStatus =
    Number(resolvedPaid || 0) <= 0
      ? "UNPAID"
      : Number(resolvedPaid || 0) < total
        ? "PARTIALLY_PAID"
        : "PAID";

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickCustomer.name.trim() || !quickCustomer.phone.trim()) {
      setError("Customer name and phone are required.");
      return;
    }
    const created = onAddCustomer(quickCustomer);
    if (!created) {
      setError("Could not create customer.");
      return;
    }
    setSelectedCustomer(created);
    setWalkIn(false);
    setShowQuickAdd(false);
    setQuickCustomer({ name: "", phone: "", email: "" });
    setError("");
  };

  const handleConfirm = async () => {
    if (!cart.length) {
      setError("Cart is empty.");
      return;
    }
    if (Number(resolvedPaid) < 0) {
      setError("Paid amount cannot be negative.");
      return;
    }

    setSubmitting(true);
    setError("");
    await new Promise((r) => setTimeout(r, 350));

    onConfirm({
      customer: walkIn
        ? "Walk-in Customer"
        : selectedCustomer?.name || "Walk-in Customer",
      phone: walkIn ? "" : selectedCustomer?.phone || "",
      customerId: walkIn ? null : selectedCustomer?.id || null,
      payment: paymentMethod,
      paymentStatus,
      paidAmount: Number(resolvedPaid || 0),
      discount: Number(discount || 0),
    });
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 no-print">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Checkout</h2>
            <p className="text-sm text-gray-500">
              Step {step} of 3 · Complete sale securely
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 border-b border-gray-100 px-6 py-3">
          {["Customer", "Payment", "Confirm"].map((label, index) => {
            const n = index + 1;
            return (
              <div
                key={label}
                className={`flex-1 rounded-lg px-3 py-2 text-center text-sm font-medium ${
                  step === n
                    ? "bg-yellow-50 text-yellow-800"
                    : step > n
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-50 text-gray-400"
                }`}
              >
                {n}. {label}
              </div>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setWalkIn(true);
                    setSelectedCustomer(null);
                  }}
                  className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    walkIn
                      ? "bg-yellow-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  Walk-in Customer
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuickAdd((v) => !v)}
                  className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  <UserPlus size={16} />
                  Quick Add Customer
                </button>
              </div>

              {showQuickAdd ? (
                <form
                  onSubmit={handleQuickAdd}
                  className="grid gap-3 rounded-xl border border-gray-200 bg-slate-50 p-4 sm:grid-cols-3"
                >
                  <input
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    placeholder="Name *"
                    value={quickCustomer.name}
                    onChange={(e) =>
                      setQuickCustomer((p) => ({ ...p, name: e.target.value }))
                    }
                  />
                  <input
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                    placeholder="Phone *"
                    value={quickCustomer.phone}
                    onChange={(e) =>
                      setQuickCustomer((p) => ({ ...p, phone: e.target.value }))
                    }
                  />
                  <div className="flex gap-2">
                    <input
                      className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="Email"
                      value={quickCustomer.email}
                      onChange={(e) =>
                        setQuickCustomer((p) => ({
                          ...p,
                          email: e.target.value,
                        }))
                      }
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-yellow-500 px-3 text-white"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </form>
              ) : null}

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={customerQuery}
                  onChange={(e) => setCustomerQuery(e.target.value)}
                  placeholder="Search customers by name, phone, email..."
                  className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-yellow-500"
                />
              </div>

              <div className="max-h-64 space-y-2 overflow-y-auto">
                {filteredCustomers.map((customer) => (
                  <button
                    key={customer.id}
                    type="button"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setWalkIn(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left ${
                      !walkIn && selectedCustomer?.id === customer.id
                        ? "border-yellow-400 bg-yellow-50"
                        : "border-gray-100 hover:bg-gray-50"
                    }`}
                  >
                    <div>
                      <p className="font-medium">{customer.name}</p>
                      <p className="text-xs text-gray-500">
                        {customer.phone}
                        {customer.email ? ` · ${customer.email}` : ""}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {customer.totalOrders} orders
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {["Cash", "Card", "Online"].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setPaymentMethod(method)}
                        className={`rounded-xl border px-3 py-3 text-sm font-medium ${
                          paymentMethod === method
                            ? "border-yellow-400 bg-yellow-50 text-yellow-800"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Order Discount
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={discount}
                    onChange={(e) => onDiscountChange(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-yellow-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Amount Paid
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={resolvedPaid}
                    onChange={(e) => {
                      setPaidTouched(true);
                      setPaidAmount(e.target.value);
                    }}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-yellow-500"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Status: {paymentStatus.replace("_", " ")}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-5">
                <h3 className="mb-4 font-semibold">Order Summary</h3>
                <div className="mb-4 max-h-40 space-y-2 overflow-y-auto text-sm">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>
                        {formatCurrency(
                          item.price * item.quantity,
                          settings.currency
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t border-gray-200 pt-3 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal, settings.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({settings.tax}%)</span>
                    <span>{formatCurrency(tax, settings.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount</span>
                    <span>
                      - {formatCurrency(discount || 0, settings.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatCurrency(total, settings.currency)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Remaining</span>
                    <span>{formatCurrency(remaining, settings.currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-gray-100 bg-slate-50 p-5">
                <h3 className="mb-3 text-lg font-bold">Review & Confirm</h3>
                <div className="grid gap-3 text-sm sm:grid-cols-2">
                  <p>
                    <span className="text-gray-500">Customer:</span>{" "}
                    <strong>
                      {walkIn
                        ? "Walk-in Customer"
                        : selectedCustomer?.name || "Walk-in Customer"}
                    </strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Payment:</span>{" "}
                    <strong>{paymentMethod}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Items:</span>{" "}
                    <strong>{cart.length}</strong>
                  </p>
                  <p>
                    <span className="text-gray-500">Total:</span>{" "}
                    <strong>
                      {formatCurrency(total, settings.currency)}
                    </strong>
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-500">
                Confirming will create the order, generate an invoice, and open
                the print dialog.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex flex-wrap justify-between gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <div className="flex gap-2">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                Back
              </button>
            ) : null}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => {
                  if (step === 1 && !walkIn && !selectedCustomer) {
                    setError("Select a customer or choose walk-in.");
                    return;
                  }
                  setError("");
                  setStep((s) => s + 1);
                }}
                className="rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-yellow-600"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={handleConfirm}
                className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-yellow-600 disabled:opacity-70"
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Confirm Payment"
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
