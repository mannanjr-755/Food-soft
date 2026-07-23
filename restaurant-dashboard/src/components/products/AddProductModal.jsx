import { useState } from "react";
import toast from "react-hot-toast";

export default function AddProductModal({
  isOpen,
  onClose,
  onAddProduct,
  categories = [],
}) {
  const categoryOptions =
    categories.length > 0
      ? categories.filter((c) => c.status !== "Inactive").map((c) => c.name)
      : ["Burger", "Pizza", "Drinks", "Fries"];

  const [formData, setFormData] = useState({
    name: "",
    category: categoryOptions[0] || "Burger",
    price: "",
    stock: "",
    status: "Available",
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

    if (
      !formData.name.trim() ||
      !formData.price ||
      !formData.stock
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const newProduct = {
      id: Date.now(),
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      status:
        Number(formData.stock) === 0
          ? "Out of Stock"
          : Number(formData.stock) < 10
          ? "Low Stock"
          : "Available",
    };

    onAddProduct(newProduct);

    setFormData({
      name: "",
      category: "Burger",
      price: "",
      stock: "",
      status: "Available",
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
            Add Product
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

            {/* Product Name */}
            <div>
              <label className="mb-2 block font-medium">
                Product Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-2 block font-medium">
                Category
              </label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              >
                {categoryOptions.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div>
              <label className="mb-2 block font-medium">
                Price
              </label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price"
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="mb-2 block font-medium">
                Stock
              </label>

              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter stock quantity"
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>

          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 border-t p-6">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-5 py-3 hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-yellow-500 px-5 py-3 text-white hover:bg-yellow-600"
            >
              Save Product
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}