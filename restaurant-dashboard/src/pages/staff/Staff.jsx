import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useAppData } from "../../context/AppDataContext";
import AddStaffModal from "../../components/staff/AddStaffModal";
import EditStaffModal from "../../components/staff/EditStaffModal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import SearchInput from "../../components/ui/SearchInput";
import { EmptyState } from "../../components/ui/States";

export default function Staff() {
  const { isAdmin } = useAuth();
  const { staff, addStaff, updateStaff, deleteStaff } = useAppData();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return staff.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(q) ||
        member.email.toLowerCase().includes(q) ||
        member.role.toLowerCase().includes(q);
      const matchesRole =
        roleFilter === "All" || member.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [staff, search, roleFilter]);

  if (!isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Staff Management
          </h1>
          <p className="mt-1 text-gray-500">
            Manage restaurant staff and access roles
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-yellow-500 px-5 py-3 font-medium text-white hover:bg-yellow-600"
        >
          <Plus size={20} />
          Add Staff
        </button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {["All", "MANAGER", "CASHIER", "WAITER"].map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setRoleFilter(role)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              roleFilter === role
                ? "bg-yellow-500 text-white"
                : "bg-white text-gray-700 shadow-sm"
            }`}
          >
            {role === "All" ? "All Roles" : role}
          </button>
        ))}
      </div>

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search staff..."
      />

      <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Staff Member
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Contact
                </th>
                <th className="p-4 text-left text-sm font-medium text-gray-600">
                  Role
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
              {filtered.map((member) => (
                <tr
                  key={member.id}
                  className="border-t border-gray-50 hover:bg-gray-50"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-yellow-100 font-bold text-yellow-700">
                        {member.name.charAt(0)}
                      </div>
                      <span className="font-semibold">{member.name}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{member.email}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {member.phone}
                    </p>
                  </td>
                  <td className="p-4">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                      {member.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`rounded-full px-3 py-1 text-sm ${
                        member.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelected(member);
                          setEditOpen(true);
                        }}
                        className="rounded-lg bg-blue-500 p-2 text-white hover:bg-blue-600"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(member.id)}
                        className="rounded-lg bg-red-500 p-2 text-white hover:bg-red-600"
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
          <EmptyState title="No staff members found." />
        ) : null}
      </div>

      <AddStaffModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onAddStaff={addStaff}
      />

      <EditStaffModal
        key={selected?.id || "staff-edit"}
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        staff={selected}
        onUpdateStaff={updateStaff}
      />

      <ConfirmModal
        isOpen={Boolean(deleteId)}
        title="Delete staff member?"
        message="Their login access will also be removed."
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteStaff(deleteId)}
      />
    </div>
  );
}
