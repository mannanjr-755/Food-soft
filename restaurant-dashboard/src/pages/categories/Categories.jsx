import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";
import AddCategoryModal from "../../components/categories/AddCategoryModal";
import EditCategoryModal from "../../components/categories/EditCategoryModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import SearchInput from "../../components/ui/SearchInput";
import { EmptyState } from "../../components/ui/States";

export default function Categories() {
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useAppData();

  const [search, setSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(
    () =>
      categories.filter((c) =>
        c.name.toLowerCase().includes(search.toLowerCase())
      ),
    [categories, search]
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Categories
          </h1>
          <p className="text-gray-500">Manage your product categories</p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 text-white hover:bg-yellow-600"
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search category..."
      />

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Category Name
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Description
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
              {filtered.map((category) => (
                <tr key={category.id} className="border-t border-gray-50 hover:bg-gray-50">
                  <td className="p-4 font-medium">{category.name}</td>
                  <td className="p-4 text-gray-600">{category.description}</td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        category.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {category.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(category);
                          setEditOpen(true);
                        }}
                        className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(category.id)}
                        className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
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
          <EmptyState
            title="No categories found"
            description="Add a category to organize your menu."
            action={
              <button
                type="button"
                onClick={() => setAddOpen(true)}
                className="rounded-lg bg-yellow-500 px-4 py-2 text-sm text-white"
              >
                Add Category
              </button>
            }
          />
        ) : null}
      </div>

      <AddCategoryModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAddCategory={addCategory}
      />

      <EditCategoryModal
        key={selected?.id || "category-edit"}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        category={selected}
        onUpdateCategory={updateCategory}
      />

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete category?"
        message="This cannot be undone. Categories linked to products cannot be deleted."
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteCategory(deleteId)}
      />
    </div>
  );
}
