import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Package,
  Search,
  XCircle,
} from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import AdjustStockModal from "../../components/inventory/AdjustStockModal";
import { EmptyState } from "../../components/ui/States";

export default function Inventory() {
  const { products, stats, updateStock } = useAppData();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const filtered = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Inventory
        </h1>
        <p className="mt-1 text-gray-500">
          Monitor and manage your product stock
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h2 className="mt-2 text-3xl font-bold">{stats.products}</h2>
            </div>
            <div className="rounded-xl bg-blue-100 p-3 text-blue-600">
              <Package size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Stock</p>
              <h2 className="mt-2 text-3xl font-bold">
                {stats.products - stats.lowStock - stats.outOfStock}
              </h2>
            </div>
            <div className="rounded-xl bg-green-100 p-3 text-green-600">
              <Package size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <h2 className="mt-2 text-3xl font-bold">{stats.lowStock}</h2>
            </div>
            <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
              <AlertTriangle size={24} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Out of Stock</p>
              <h2 className="mt-2 text-3xl font-bold">{stats.outOfStock}</h2>
            </div>
            <div className="rounded-xl bg-red-100 p-3 text-red-600">
              <XCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center rounded-lg border px-3">
          <Search size={20} className="text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search product..."
            className="w-full p-3 outline-none"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Product
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Category
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Current Stock
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Minimum Stock
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Status
                </th>
                <th className="p-4 text-center text-sm font-medium text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-gray-50 hover:bg-gray-50"
                >
                  <td className="p-4 font-semibold">{product.name}</td>
                  <td className="p-4 text-gray-600">{product.category}</td>
                  <td className="p-4 font-bold">{product.stock}</td>
                  <td className="p-4">{product.minStock}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        product.stockStatus === "In Stock"
                          ? "bg-green-100 text-green-700"
                          : product.stockStatus === "Low Stock"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.stockStatus}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(product);
                        setOpen(true);
                      }}
                      className="rounded-lg bg-blue-500 px-4 py-2 text-sm text-white hover:bg-blue-600"
                    >
                      Adjust Stock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No products found." />
        ) : null}
      </div>

      <AdjustStockModal
        isOpen={open}
        onClose={() => setOpen(false)}
        product={selected}
        onUpdateStock={updateStock}
      />
    </div>
  );
}
