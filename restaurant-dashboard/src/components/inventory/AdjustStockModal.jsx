import { useState } from "react";

export default function AdjustStockModal({
  isOpen,
  onClose,
  product,
  onUpdateStock,
}) {
  const [action, setAction] = useState("add");
  const [quantity, setQuantity] = useState("");

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const amount = Number(quantity);

    if (!amount || amount <= 0) {
      alert("Please enter a valid quantity");
      return;
    }

    const newStock =
      action === "add"
        ? product.stock + amount
        : Math.max(0, product.stock - amount);

    onUpdateStock(product.id, newStock);

    setQuantity("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">

        <div className="flex items-center justify-between border-b p-6">
          <div>
            <h2 className="text-2xl font-bold">
              Adjust Stock
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {product.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="space-y-5 p-6">

            <div className="rounded-lg bg-gray-100 p-4">
              <p className="text-sm text-gray-500">
                Current Stock
              </p>

              <p className="text-3xl font-bold">
                {product.stock}
              </p>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Action
              </label>

              <select
                value={action}
                onChange={(e) =>
                  setAction(e.target.value)
                }
                className="w-full rounded-lg border p-3 outline-none"
              >
                <option value="add">
                  Add Stock
                </option>

                <option value="remove">
                  Remove Stock
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium">
                Quantity
              </label>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                placeholder="Enter quantity"
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>

          </div>

          <div className="flex justify-end gap-3 border-t p-6">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-3"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-yellow-500 px-5 py-3 text-white"
            >
              Update Stock
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}