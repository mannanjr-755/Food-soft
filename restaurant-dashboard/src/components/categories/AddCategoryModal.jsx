import { useState } from "react";
import toast from "react-hot-toast";

export default function AddCategoryModal({
  isOpen,
  onClose,
  onAddCategory,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "Active",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const newCategory = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      status: formData.status,
    };

    onAddCategory(newCategory);

    setFormData({
      name: "",
      description: "",
      status: "Active",
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">

          <h2 className="text-2xl font-bold text-gray-800">
            Add Category
          </h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-gray-800"
          >
            ×
          </button>

        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>

          <div className="space-y-5 p-6">

            {/* Name */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Category Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter category name"
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter category description"
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>

            {/* Status */}
            <div>
              <label className="mb-2 block font-medium text-gray-700">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t p-6">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-2 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-yellow-500 px-5 py-2 text-white hover:bg-yellow-600"
            >
              Save Category
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}