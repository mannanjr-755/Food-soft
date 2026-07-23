import { useMemo, useState } from "react";
import {
  Minus,
  Plus,
  Printer,
  RotateCcw,
  Search,
  ShoppingCart,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext";
import { useAuth } from "../../context/AuthContext";
import {
  formatCurrency,
  productSku,
} from "../../lib/format";
import InvoiceReceipt from "../../components/invoice/InvoiceReceipt";
import { EmptyState } from "../../components/ui/States";
import CheckoutModal from "./CheckoutModal";

export default function POS() {
  const {
    products,
    categories,
    customers,
    settings,
    addOrder,
    addCustomer,
  } = useAppData();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [availabilityFilter, setAvailabilityFilter] = useState("All");
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  const categoryTabs = useMemo(
    () => [
      "All",
      ...categories
        .filter((c) => c.status === "Active")
        .map((c) => c.name),
    ],
    [categories]
  );

  const availableProducts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      if (p.status !== "Active") return false;
      const matchesCategory =
        selectedCategory === "All" || p.category === selectedCategory;
      const matchesAvailability =
        availabilityFilter === "All" ||
        (availabilityFilter === "In Stock" && p.stock > 0) ||
        (availabilityFilter === "Out of Stock" && p.stock <= 0);
      const sku = productSku(p).toLowerCase();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        sku.includes(q) ||
        String(p.id).includes(q);
      return matchesCategory && matchesAvailability && matchesSearch;
    });
  }, [products, selectedCategory, availabilityFilter, search]);

  const taxRate = Number(settings.tax || 5) / 100;
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = subtotal * taxRate;
  const total = Math.max(0, subtotal + tax - Number(discount || 0));
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, lineDiscount: 0 }];
    });
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const max = products.find((p) => p.id === id)?.stock ?? item.quantity;
        if (item.quantity >= max) return item;
        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearSale = () => {
    setCart([]);
    setDiscount(0);
    setCompletedOrder(null);
    setCheckoutOpen(false);
    setCartOpen(false);
  };

  const handleConfirmCheckout = (checkoutData) => {
    const order = addOrder({
      customer: checkoutData.customer,
      phone: checkoutData.phone,
      customerId: checkoutData.customerId,
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        discount: item.lineDiscount || 0,
      })),
      itemsLabel: cart
        .map((item) => `${item.name} x${item.quantity}`)
        .join(", "),
      subtotal,
      tax,
      discount: Number(checkoutData.discount || 0),
      total: Math.max(
        0,
        subtotal + tax - Number(checkoutData.discount || 0)
      ),
      payment: checkoutData.payment,
      paymentStatus: checkoutData.paymentStatus,
      paidAmount: checkoutData.paidAmount,
      status: "Completed",
      waiter: user?.name || "Counter",
      staffName: user?.name || "Counter",
      tableNumber: checkoutData.tableNumber || "—",
      persons: checkoutData.persons || "—",
    });

    setCart([]);
    setDiscount(0);
    setCheckoutOpen(false);
    setCartOpen(false);
    setCompletedOrder(order);

    window.setTimeout(() => {
      window.print();
    }, 450);
  };

  const CartPanel = (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart size={20} className="text-yellow-600" />
          <h2 className="text-lg font-bold">Current Sale</h2>
          <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">
            {cartCount}
          </span>
        </div>
        {cart.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setCart([]);
              setDiscount(0);
            }}
            className="text-xs font-medium text-red-600 hover:underline"
          >
            Clear
          </button>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {cart.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-200 bg-slate-50 px-4 py-10 text-center">
            <p className="font-medium text-gray-700">Your cart is empty</p>
            <p className="mt-1 text-sm text-gray-500">
              Add a product to start a new sale.
            </p>
          </div>
        ) : (
          cart.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm"
            >
              <div className="flex gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-yellow-50 text-sm font-bold text-yellow-700">
                  {item.name.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="truncate font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(item.price, settings.currency)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                      className="rounded-lg p-1 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decreaseQuantity(item.id)}
                        className="rounded-lg bg-gray-100 p-1.5 hover:bg-gray-200"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => increaseQuantity(item.id)}
                        className="rounded-lg bg-gray-100 p-1.5 hover:bg-gray-200"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-bold">
                      {formatCurrency(
                        item.price * item.quantity,
                        settings.currency
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal, settings.currency)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Tax ({settings.tax}%)</span>
          <span>{formatCurrency(tax, settings.currency)}</span>
        </div>
        <div className="flex items-center justify-between gap-3 text-gray-600">
          <span>Discount</span>
          <input
            type="number"
            min="0"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="w-28 rounded-lg border border-gray-200 px-2 py-1 text-right text-sm outline-none focus:border-yellow-500"
          />
        </div>
        <div className="flex justify-between pt-2 text-xl font-bold text-gray-900">
          <span>Total</span>
          <span>{formatCurrency(total, settings.currency)}</span>
        </div>
      </div>

      <button
        type="button"
        disabled={cart.length === 0}
        onClick={() => setCheckoutOpen(true)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-500 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ShoppingCart size={20} />
        Checkout
      </button>
    </div>
  );

  if (completedOrder) {
    return (
      <div>
        <div className="no-print mb-6 rounded-2xl border border-green-100 bg-green-50 p-5">
          <h1 className="text-2xl font-bold text-green-800">
            Order completed successfully
          </h1>
          <p className="mt-1 text-sm text-green-700">
            Invoice {completedOrder.invoiceNumber} created for{" "}
            {completedOrder.customer}. The print dialog should open
            automatically.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-yellow-600"
            >
              <Printer size={16} />
              Print Invoice
            </button>
            <button
              type="button"
              onClick={clearSale}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              <RotateCcw size={16} />
              New Sale
            </button>
            <Link
              to="/orders"
              className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              View Orders
            </Link>
          </div>
        </div>

        <div className="print-area mx-auto w-fit rounded-lg border border-gray-200 bg-white shadow-sm">
          <InvoiceReceipt order={completedOrder} settings={settings} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="no-print mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Point of Sale
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Search products, build a cart, and complete checkout with invoice
            printing.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-white xl:hidden"
        >
          <ShoppingCart size={18} />
          Cart ({cartCount})
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="no-print space-y-4 xl:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, category, SKU or ID..."
                className="w-full rounded-xl border border-gray-200 bg-slate-50 py-3 pl-10 pr-4 text-sm outline-none focus:border-yellow-500 focus:bg-white"
              />
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {categoryTabs.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                    selectedCategory === category
                      ? "bg-yellow-500 text-white"
                      : "bg-slate-100 text-gray-700 hover:bg-yellow-50"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {["All", "In Stock", "Out of Stock"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setAvailabilityFilter(status)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                    availabilityFilter === status
                      ? "bg-slate-800 text-white"
                      : "bg-white text-gray-600 ring-1 ring-gray-200"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {availableProducts.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white">
              <EmptyState
                title="No products found"
                description="Try another search or category filter."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {availableProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                >
                  <div className="mb-3 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-amber-50 to-slate-50 text-3xl font-bold text-yellow-700">
                    {product.name.charAt(0)}
                  </div>
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900">{product.name}</h3>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        product.stock > 0
                          ? "bg-green-50 text-green-700"
                          : "bg-red-50 text-red-700"
                      }`}
                    >
                      {product.availability}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {product.category} · {productSku(product)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Stock: {product.stock}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(product.price, settings.currency)}
                    </span>
                    <button
                      type="button"
                      disabled={product.stock <= 0}
                      onClick={() => addToCart(product)}
                      className="inline-flex items-center gap-1 rounded-lg bg-yellow-500 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-600 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Plus size={16} />
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="no-print hidden xl:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            {CartPanel}
          </div>
        </div>
      </div>

      {cartOpen ? (
        <div className="fixed inset-0 z-40 xl:hidden no-print">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close cart"
            onClick={() => setCartOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-hidden rounded-t-3xl bg-white p-5 shadow-2xl">
            <div className="mb-3 flex justify-end">
              <button
                type="button"
                onClick={() => setCartOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto">{CartPanel}</div>
          </div>
        </div>
      ) : null}

      <CheckoutModal
        key={checkoutOpen ? `checkout-${cart.length}-${total}` : "checkout-closed"}
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onConfirm={handleConfirmCheckout}
        cart={cart}
        customers={customers}
        settings={settings}
        subtotal={subtotal}
        tax={tax}
        discount={Number(discount || 0)}
        total={total}
        onDiscountChange={setDiscount}
        onAddCustomer={(data) => addCustomer(data)}
      />
    </div>
  );
}
