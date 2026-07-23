export function formatCurrency(amount, currency = "PKR") {
  const value = Math.round(Number(amount) || 0);
  if (currency === "USD") {
    return `$ ${value.toLocaleString()}`;
  }
  if (currency === "AED") {
    return `AED ${value.toLocaleString()}`;
  }
  return `Rs. ${value.toLocaleString()}`;
}

export function formatDateTime(timestamp) {
  const date = new Date(timestamp || 0);
  if (Number.isNaN(date.getTime()) || !timestamp) {
    return { dateLabel: "—", timeLabel: "—" };
  }
  return {
    dateLabel: date.toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    timeLabel: date.toLocaleTimeString("en-PK", {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
}

export function isSameDay(timestamp, compareTo = Date.now()) {
  const a = new Date(timestamp);
  const b = new Date(compareTo);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getStockStatus(stock, minStock = 10) {
  if (stock <= 0) return "Out of Stock";
  if (stock <= minStock) return "Low Stock";
  return "In Stock";
}

/** Catalog/POS availability label derived from stock levels. */
export function getProductAvailability(stock, minStock = 10) {
  const status = getStockStatus(stock, minStock);
  return status === "In Stock" ? "Available" : status;
}

export function productSku(product) {
  return product?.sku || `SKU-${String(product?.id || 0).padStart(4, "0")}`;
}
