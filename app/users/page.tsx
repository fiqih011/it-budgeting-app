"use client";

import { useEffect, useState } from "react";
import RoleGate from "@/components/auth/RoleGate";
import UserTable, { UserRow } from "@/components/users/UserTable";
import CreateUserModal from "@/components/users/CreateUserModal";

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  async function loadUsers() {
    setLoading(true);
    const res = await fetch("/api/users", { cache: "no-store" });
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <RoleGate allow={["ADMIN"]}>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">User Management</h1>
          <button
            onClick={() => setOpenCreate(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            + Create User
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : (
          <UserTable users={users} onReload={loadUsers} />
        )}

        <CreateUserModal
          open={openCreate}
          onClose={() => setOpenCreate(false)}
          onCreated={loadUsers}
        />
      </div>
    </RoleGate>
  );
}
