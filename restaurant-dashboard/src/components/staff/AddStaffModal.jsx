import { useState } from "react";
import toast from "react-hot-toast";

export default function AddStaffModal({
  isOpen,
  onClose,
  onAddStaff,
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "CASHIER",
    password: "",
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
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password.trim()
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const newStaff = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: "Active",
    };

    onAddStaff(newStaff);

    setFormData({
      name: "",
      email: "",
      phone: "",
      role: "CASHIER",
      password: "",
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
            Add Staff Member
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
              <label className="mb-2 block font-medium">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block font-medium">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="mb-2 block font-medium">
                Phone
              </label>

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="0300-1234567"
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>

            {/* Role */}
            <div>
              <label className="mb-2 block font-medium">
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              >
                <option value="MANAGER">Manager</option>
                <option value="CASHIER">Cashier</option>
                <option value="WAITER">Waiter</option>
              </select>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block font-medium">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
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
              Save Staff
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
    