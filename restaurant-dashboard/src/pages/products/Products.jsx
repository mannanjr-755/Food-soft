import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import { formatCurrency } from "../../lib/format";
import AddProductModal from "../../components/products/AddProductModal";
import EditProductModal from "../../components/products/EditProductModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import SearchInput from "../../components/ui/SearchInput";
import { EmptyState } from "../../components/ui/States";

export default function Products() {
  const {
    products,
    categories,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useAppData();

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(
    () =>
      products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      ),
    [products, search]
  );

  const handleAdd = (data) => {
    addProduct({
      name: data.name,
      category: data.category,
      price: data.price,
      stock: data.stock,
      status: "Active",
    });
  };

  const handleUpdate = (data) => {
    updateProduct({
      ...data,
      status: data.status === "Inactive" ? "Inactive" : "Active",
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Products
          </h1>
          <p className="mt-1 text-gray-500">
            Manage menu items with stock awareness
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 font-medium text-white hover:bg-yellow-600"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search product..."
      />

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Product
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Category
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Price
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Stock
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Availability
                </th>
                <th className="p-4 text-center text-sm font-medium text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-gray-50 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-50 text-sm font-bold text-yellow-700">
                        {product.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="text-xs text-gray-500">
                          {product.status}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">{product.category}</td>
                  <td className="p-4 font-semibold">
                    {formatCurrency(product.price, settings.currency)}
                  </td>
                  <td className="p-4">{product.stock}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        product.availability === "Available"
                          ? "bg-green-100 text-green-700"
                          : product.availability === "Low Stock"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.availability}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(product);
                          setEditOpen(true);
                        }}
                        className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                        aria-label={`Edit ${product.name}`}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(product.id)}
                        className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
                        aria-label={`Delete ${product.name}`}
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
          <EmptyState title="No products found." />
        ) : null}
      </div>

      <AddProductModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAddProduct={handleAdd}
        categories={categories}
      />

      <EditProductModal
        key={selected?.id || "product-edit"}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        product={selected}
        onUpdateProduct={handleUpdate}
        categories={categories}
      />

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete product?"
        message="This will permanently remove the product."
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteProduct(deleteId)}
      />
    </div>
  );
}
