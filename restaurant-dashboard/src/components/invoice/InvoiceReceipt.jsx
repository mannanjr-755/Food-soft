import { useState } from "react";
import { formatCurrency, formatDateTime } from "../../lib/format";

function Row({ label, value }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="receipt-meta-row">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}

export default function InvoiceReceipt({ order, settings }) {
  const [printNow] = useState(() => formatDateTime(Date.now()));

  if (!order) return null;

  const { dateLabel, timeLabel } = formatDateTime(order.createdAt);
  const currency = settings?.currency || "PKR";
  const paid = Number(order.paidAmount ?? 0);
  const total = Number(order.total ?? 0);
  const remaining = Math.max(0, total - paid);
  const items = Array.isArray(order.items) ? order.items : [];
  const token =
    order.tokenNumber ||
    String(order.invoiceNumber || order.id || "")
      .replace(/\D/g, "")
      .slice(-4) ||
    "—";
  const businessName = settings?.restaurantName || "Restaurant";

  return (
    <div className="receipt invoice-receipt" aria-label="Thermal receipt">
      <header className="receipt-header">
        {settings?.logo ? (
          <img
            src={settings.logo}
            alt={businessName}
            className="receipt-logo"
          />
        ) : (
          <div className="receipt-logo-fallback" aria-hidden="true">
            {businessName.charAt(0)}
          </div>
        )}
        <h1 className="receipt-title">{businessName}</h1>
        {settings?.address ? (
          <p className="receipt-contact">{settings.address}</p>
        ) : null}
        {settings?.phone || settings?.email ? (
          <p className="receipt-contact">
            {[settings?.phone, settings?.email].filter(Boolean).join(" · ")}
          </p>
        ) : null}
      </header>

      <div className="receipt-divider" />

      <section className="receipt-meta">
        <Row label="Invoice #" value={order.invoiceNumber || order.id} />
        <Row
          label="Print Date"
          value={`${printNow.dateLabel} ${printNow.timeLabel}`}
        />
        <Row label="Order Date" value={`${dateLabel} ${timeLabel}`} />
        <Row label="Token #" value={token} />
        <Row label="Table #" value={order.tableNumber || "—"} />
        <Row label="Persons" value={order.persons ?? "—"} />
        <Row
          label="Waiter"
          value={order.waiter || order.staffName || "Counter"}
        />
        <Row label="Customer" value={order.customer || "Walk-in Customer"} />
        {order.phone ? <Row label="Phone" value={order.phone} /> : null}
        <Row label="Payment" value={order.payment || "—"} />
        <Row label="Status" value={order.paymentStatus || "PAID"} />
      </section>

      <div className="receipt-divider" />

      <table className="receipt-items">
        <thead>
          <tr>
            <th className="col-qty">Qty</th>
            <th className="col-desc">Item</th>
            <th className="col-rate">Rate</th>
            <th className="col-amt">Amt</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const lineTotal =
              item.price * item.quantity - Number(item.discount || 0);
            return (
              <tr key={`${item.name}-${index}`}>
                <td className="col-qty">{item.quantity}</td>
                <td className="col-desc">
                  {item.name}
                  {item.discount ? (
                    <span className="receipt-item-note">
                      {" "}
                      (disc {formatCurrency(item.discount, currency)})
                    </span>
                  ) : null}
                </td>
                <td className="col-rate">
                  {formatCurrency(item.price, currency)}
                </td>
                <td className="col-amt">
                  {formatCurrency(lineTotal, currency)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="receipt-divider" />

      <section className="receipt-totals">
        <div className="receipt-total-row">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal, currency)}</span>
        </div>
        {Number(order.discount) > 0 ? (
          <div className="receipt-total-row">
            <span>Discount</span>
            <span>- {formatCurrency(order.discount, currency)}</span>
          </div>
        ) : null}
        <div className="receipt-total-row">
          <span>Tax / SST</span>
          <span>{formatCurrency(order.tax || 0, currency)}</span>
        </div>
        <div className="receipt-total-row receipt-total-strong">
          <span>Total Bill</span>
          <span>{formatCurrency(total, currency)}</span>
        </div>
        <div className="receipt-total-row">
          <span>Paid</span>
          <span>{formatCurrency(paid, currency)}</span>
        </div>
        <div className="receipt-total-row">
          <span>Balance</span>
          <span>{formatCurrency(remaining, currency)}</span>
        </div>
      </section>

      <div className="receipt-divider dashed" />

      <footer className="receipt-footer">
        <p className="receipt-thanks">Thank you for your visit!</p>
        <p>
          Customer: <strong>{order.customer || "Walk-in Customer"}</strong>
        </p>
        <p>
          Counter: {order.waiter || order.staffName || "Counter"} ·{" "}
          {order.payment || "Cash"}
        </p>
        {settings?.phone ? <p>Contact: {settings.phone}</p> : null}
        <p className="receipt-software">
          Created by Restaurant POS · Retain this receipt
        </p>
      </footer>
    </div>
  );
}
