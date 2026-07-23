/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import {
  DEMO_USERS,
  SEED_CATEGORIES,
  SEED_CUSTOMERS,
  SEED_ORDERS,
  SEED_PRODUCTS,
  SEED_SETTINGS,
} from "../data/seed";
import { getProductAvailability, getStockStatus, isSameDay } from "../lib/format";
import { loadJSON, saveJSON } from "../lib/storage";
import { useAuth } from "./AuthContext";

const AppDataContext = createContext(null);

function nextId(items) {
  const max = items.reduce(
    (acc, item) => Math.max(acc, Number(item.id) || 0),
    0
  );
  return max + 1;
}

function nextOrderId(orders) {
  const nums = orders
    .map((o) => {
      const match = String(o.id).match(/(\d+)/);
      return match ? Number(match[1]) : 0;
    })
    .filter(Boolean);
  const max = nums.length ? Math.max(...nums) : 1000;
  return `#ORD-${max + 1}`;
}

export function AppDataProvider({ children }) {
  const { upsertAuthUser, removeAuthUser } = useAuth();

  const [categories, setCategories] = useState(() =>
    loadJSON("categories", SEED_CATEGORIES)
  );
  const [products, setProducts] = useState(() =>
    loadJSON("products", SEED_PRODUCTS)
  );
  const [orders, setOrders] = useState(() =>
    loadJSON("orders", SEED_ORDERS)
  );
  const [customers, setCustomers] = useState(() =>
    loadJSON("customers", SEED_CUSTOMERS)
  );
  const [staff, setStaff] = useState(() =>
    loadJSON(
      "staff",
      DEMO_USERS.filter((u) => u.role !== "ADMIN").map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
      }))
    )
  );
  const [settings, setSettings] = useState(() =>
    loadJSON("settings", SEED_SETTINGS)
  );

  useEffect(() => saveJSON("categories", categories), [categories]);
  useEffect(() => saveJSON("products", products), [products]);
  useEffect(() => saveJSON("orders", orders), [orders]);
  useEffect(() => saveJSON("customers", customers), [customers]);
  useEffect(() => saveJSON("staff", staff), [staff]);
  useEffect(() => saveJSON("settings", settings), [settings]);

  const addCategory = useCallback((data) => {
    setCategories((prev) => [...prev, { ...data, id: nextId(prev) }]);
    toast.success("Category created");
  }, []);

  const updateCategory = useCallback((data) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === data.id ? { ...c, ...data } : c))
    );
    toast.success("Category updated");
  }, []);

  const deleteCategory = useCallback(
    (id) => {
      const category = categories.find((c) => c.id === id);
      const linked = products.some((p) => p.category === category?.name);
      if (linked) {
        toast.error(
          "Cannot delete: category is linked to existing products."
        );
        return false;
      }
      setCategories((prev) => prev.filter((c) => c.id !== id));
      toast.success("Category deleted");
      return true;
    },
    [categories, products]
  );

  const addProduct = useCallback((data) => {
    setProducts((prev) => [
      ...prev,
      {
        stock: Number(data.stock) || 0,
        minStock: Number(data.minStock) || 10,
        status: data.status || "Active",
        description: data.description || "",
        ...data,
        id: nextId(prev),
        price: Number(data.price),
      },
    ]);
    toast.success("Product created");
  }, []);

  const updateProduct = useCallback((data) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === data.id
          ? { ...p, ...data, price: Number(data.price) }
          : p
      )
    );
    toast.success("Product updated");
  }, []);

  const deleteProduct = useCallback((id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast.success("Product deleted");
  }, []);

  const updateStock = useCallback((id, newStock) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, stock: Math.max(0, Number(newStock)) }
          : p
      )
    );
    toast.success("Stock updated");
  }, []);

  const addOrder = useCallback((orderData) => {
    let created = null;

    setOrders((prev) => {
      const id = nextOrderId(prev);
      const numeric = id.replace(/\D/g, "");
      const createdAt = Date.now();
      created = {
        phone: "",
        customerId: null,
        discount: 0,
        tax: 0,
        subtotal: 0,
        paidAmount: Number(orderData.total) || 0,
        paymentStatus: "PAID",
        status: "Completed",
        ...orderData,
        id,
        invoiceNumber: orderData.invoiceNumber || `INV-${numeric}`,
        createdAt,
        date:
          orderData.date ||
          `Today, ${new Date(createdAt).toLocaleTimeString("en-PK", {
            hour: "2-digit",
            minute: "2-digit",
          })}`,
      };
      return [created, ...prev];
    });

    if (!created) return null;

    setProducts((productsPrev) =>
      productsPrev.map((p) => {
        const line = created.items?.find((i) => i.productId === p.id);
        if (!line) return p;
        return {
          ...p,
          stock: Math.max(0, p.stock - line.quantity),
        };
      })
    );

    if (created.customer && created.customer !== "Walk-in Customer") {
      setCustomers((customersPrev) => {
        const existing = customersPrev.find(
          (c) =>
            (created.customerId && c.id === created.customerId) ||
            c.name.toLowerCase() === created.customer.toLowerCase()
        );
        if (existing) {
          return customersPrev.map((c) =>
            c.id === existing.id
              ? {
                  ...c,
                  totalOrders: c.totalOrders + 1,
                  totalSpent: c.totalSpent + Number(created.total),
                  lastOrder: "Today",
                }
              : c
          );
        }
        return [
          ...customersPrev,
          {
            id: nextId(customersPrev),
            name: created.customer,
            phone: created.phone || "",
            email: created.email || "",
            totalOrders: 1,
            totalSpent: Number(created.total),
            lastOrder: "Today",
          },
        ];
      });
    }

    toast.success(`Order ${created.id} completed`);
    return created;
  }, []);

  const updateOrderStatus = useCallback((id, status) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    toast.success(`Order marked as ${status}`);
  }, []);

  const updatePaymentStatus = useCallback((id, paymentStatus, paidAmount) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const paid =
          paidAmount !== undefined
            ? Number(paidAmount)
            : paymentStatus === "PAID"
              ? Number(o.total)
              : paymentStatus === "UNPAID"
                ? 0
                : Number(o.paidAmount || 0);
        return { ...o, paymentStatus, paidAmount: paid };
      })
    );
    toast.success(`Payment marked as ${paymentStatus}`);
  }, []);

  const deleteOrder = useCallback((id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    toast.success("Order deleted");
  }, []);

  const addCustomer = useCallback((data) => {
    let created = null;
    setCustomers((prev) => {
      created = {
        totalOrders: 0,
        totalSpent: 0,
        lastOrder: "Never",
        ...data,
        id: nextId(prev),
      };
      return [...prev, created];
    });
    toast.success("Customer added");
    return created;
  }, []);

  const updateCustomer = useCallback((data) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === data.id ? { ...c, ...data } : c))
    );
    toast.success("Customer updated");
  }, []);

  const deleteCustomer = useCallback((id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    toast.success("Customer deleted");
  }, []);

  const addStaff = useCallback(
    (data) => {
      const { password, ...rest } = data;
      setStaff((prev) => {
        const member = {
          ...rest,
          id: nextId(prev),
          status: rest.status || "Active",
        };
        upsertAuthUser({
          ...member,
          password: password || "changeme123",
        });
        return [...prev, member];
      });
      toast.success("Staff member added");
    },
    [upsertAuthUser]
  );

  const updateStaff = useCallback(
    (data) => {
      const { password, ...rest } = data;
      setStaff((prev) =>
        prev.map((s) => (s.id === rest.id ? { ...s, ...rest } : s))
      );
      upsertAuthUser({
        ...rest,
        ...(password ? { password } : {}),
      });
      toast.success("Staff updated");
    },
    [upsertAuthUser]
  );

  const deleteStaff = useCallback(
    (id) => {
      setStaff((prev) => {
        const target = prev.find((s) => s.id === id);
        if (target) removeAuthUser(target.email);
        return prev.filter((s) => s.id !== id);
      });
      toast.success("Staff member deleted");
    },
    [removeAuthUser]
  );

  const saveSettings = useCallback((data) => {
    setSettings((prev) => ({ ...prev, ...data }));
    toast.success("Settings saved");
  }, []);

  const stats = useMemo(() => {
    const completed = orders.filter(
      (o) => o.status === "Completed" || o.status === "CONFIRMED"
    );
    const paidOrders = orders.filter((o) => o.paymentStatus === "PAID");
    const unpaidOrders = orders.filter(
      (o) =>
        o.paymentStatus === "UNPAID" || o.paymentStatus === "PARTIALLY_PAID"
    );
    const revenue = paidOrders.reduce(
      (sum, o) => sum + Number(o.paidAmount ?? o.total ?? 0),
      0
    );
    const outstanding = unpaidOrders.reduce((sum, o) => {
      const total = Number(o.total || 0);
      const paid = Number(o.paidAmount || 0);
      return sum + Math.max(0, total - paid);
    }, 0);
    const todayOrders = orders.filter((o) => isSameDay(o.createdAt));
    const todaySales = todayOrders
      .filter((o) => o.status !== "Cancelled" && o.status !== "CANCELLED")
      .reduce((sum, o) => sum + Number(o.total || 0), 0);

    return {
      totalOrders: orders.length,
      revenue,
      todaySales,
      todayOrders: todayOrders.length,
      outstanding,
      paidAmount: revenue,
      customers: customers.length,
      products: products.length,
      activeProducts: products.filter((p) => p.status === "Active").length,
      pendingOrders: orders.filter(
        (o) => o.status === "Pending" || o.status === "PENDING"
      ).length,
      completedOrders: completed.length,
      lowStock: products.filter(
        (p) => p.stock > 0 && p.stock <= (p.minStock || 10)
      ).length,
      outOfStock: products.filter((p) => p.stock <= 0).length,
      staff: staff.length,
      categories: categories.length,
    };
  }, [orders, products, customers, staff, categories]);

  const enrichedProducts = useMemo(
    () =>
      products.map((p) => ({
        ...p,
        stockStatus: getStockStatus(p.stock, p.minStock),
        availability: getProductAvailability(p.stock, p.minStock),
      })),
    [products]
  );

  const value = useMemo(
    () => ({
      categories,
      products: enrichedProducts,
      orders,
      customers,
      staff,
      settings,
      stats,
      addCategory,
      updateCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      addOrder,
      updateOrderStatus,
      updatePaymentStatus,
      deleteOrder,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addStaff,
      updateStaff,
      deleteStaff,
      saveSettings,
    }),
    [
      categories,
      enrichedProducts,
      orders,
      customers,
      staff,
      settings,
      stats,
      addCategory,
      updateCategory,
      deleteCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      updateStock,
      addOrder,
      updateOrderStatus,
      updatePaymentStatus,
      deleteOrder,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      addStaff,
      updateStaff,
      deleteStaff,
      saveSettings,
    ]
  );

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData must be used within AppDataProvider");
  }
  return ctx;
}
