import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import { formatCurrency } from "../../lib/format";
import AddProductModal from "../../components/menu/AddProductModal";
import EditProductModal from "../../components/menu/EditProductModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import SearchInput from "../../components/ui/SearchInput";
import { EmptyState } from "../../components/ui/States";

export default function Menu() {
  const {
    products,
    categories,
    settings,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useAppData();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || product.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const handleAdd = (data) => {
    addProduct({
      ...data,
      status: data.status === "Inactive" ? "Inactive" : "Active",
      stock: data.stock ?? 20,
    });
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Menu Management
          </h1>
          <p className="text-gray-500">Manage your restaurant products</p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-white hover:bg-yellow-600"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["All", "Active", "Inactive"].map((status) => (
          <button
            key={status}
            type="button"
            onClick={() => setStatusFilter(status)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              statusFilter === status
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-700 shadow-sm hover:bg-gray-50"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search product..."
      />

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Name
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Category
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Price
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
              {filtered.map((product) => (
                <tr
                  key={product.id}
                  className="border-t border-gray-50 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium">{product.name}</td>
                  <td className="p-4">{product.category}</td>
                  <td className="p-4">
                    {formatCurrency(product.price, settings.currency)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        product.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.status}
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
          <EmptyState title="No products found" />
        ) : null}
      </div>

      <AddProductModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAddProduct={handleAdd}
        categories={categories}
      />

      <EditProductModal
        key={selected?.id || "menu-edit"}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        product={selected}
        onUpdateProduct={updateProduct}
        categories={categories}
      />

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete product?"
        message="This product will be removed from the menu."
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteProduct(deleteId)}
      />
    </div>
  );
}
