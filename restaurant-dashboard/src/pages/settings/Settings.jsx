import { useState } from "react";
import { Save, Store, Upload } from "lucide-react";
import { useAppData } from "../../context/AppDataContext";

export default function Settings() {
  const { settings, saveSettings } = useAppData();
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, logo: imageUrl }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 250));
    saveSettings(form);
    setSaving(false);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-gray-500">Manage your restaurant settings</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-6 max-w-4xl rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-4 border-b border-gray-100 p-6">
            <div className="rounded-xl bg-yellow-100 p-3 text-yellow-600">
              <Store size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Restaurant Information</h2>
              <p className="text-sm text-gray-500">
                Update your restaurant details
              </p>
            </div>
          </div>

          <div className="grid gap-5 p-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-medium">Restaurant Name</label>
              <input
                type="text"
                name="restaurantName"
                value={form.restaurantName}
                onChange={handleChange}
                required
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium">Currency</label>
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              >
                <option value="PKR">PKR - Pakistani Rupee</option>
                <option value="USD">USD - US Dollar</option>
                <option value="AED">AED - UAE Dirham</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block font-medium">
                Restaurant Address
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows="3"
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>
            <div>
              <label className="mb-2 block font-medium">
                Tax Percentage (%)
              </label>
              <input
                type="number"
                name="tax"
                value={form.tax}
                onChange={handleChange}
                min="0"
                max="100"
                className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 max-w-4xl rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 p-6">
            <h2 className="text-xl font-bold">Logo & Business Hours</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your restaurant logo and operating hours
            </p>
          </div>

          <div className="space-y-6 p-6">
            <div>
              <label className="mb-3 block font-medium">Restaurant Logo</label>
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-xl border bg-gray-100">
                  {form.logo ? (
                    <img
                      src={form.logo}
                      alt="Restaurant Logo"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Store size={35} className="text-gray-400" />
                  )}
                </div>
                <label className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 hover:bg-gray-50">
                  <Upload size={20} />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="mb-3 block font-medium">
                Restaurant Status
              </label>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, isOpen: !prev.isOpen }))
                }
                className={`rounded-lg px-5 py-3 font-medium ${
                  form.isOpen
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {form.isOpen ? "Restaurant is Open" : "Restaurant is Closed"}
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block font-medium">Opening Time</label>
                <input
                  type="time"
                  name="openingTime"
                  value={form.openingTime}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
                />
              </div>
              <div>
                <label className="mb-2 block font-medium">Closing Time</label>
                <input
                  type="time"
                  name="closingTime"
                  value={form.closingTime}
                  onChange={handleChange}
                  className="w-full rounded-lg border p-3 outline-none focus:border-yellow-500"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-yellow-500 px-6 py-3 font-medium text-white hover:bg-yellow-600 disabled:opacity-70"
            >
              <Save size={20} />
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
