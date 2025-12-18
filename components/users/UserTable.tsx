"use client";

import { useState } from "react";
import ResetPasswordModal from "@/components/users/ResetPasswordModal";

export type UserRow = {
  id: string;
  name: string | null;
  email: string;
  role: "ADMIN" | "VIEWER";
  active: boolean;
};

type Props = {
  users: UserRow[];
  onReload: () => Promise<void>;
};

export default function UserTable({ users, onReload }: Props) {
  const [resetUserId, setResetUserId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function toggleActive(userId: string) {
    try {
      setLoadingId(userId);
      await fetch(`/api/users/${userId}/toggle-active`, {
        method: "PATCH",
      });
      await onReload();
    } finally {
      setLoadingId(null);
    }
  }

  if (users.length === 0) {
    return <p className="text-gray-500 text-sm">Belum ada user</p>;
  }

  return (
    <>
      <div className="overflow-x-auto border rounded-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name ?? "-"}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-gray-200 text-xs">
                    {u.role}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      u.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.active ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="p-3 space-x-3 text-xs">
                  <button
                    onClick={() => setResetUserId(u.id)}
                    className="text-blue-600 hover:underline"
                  >
                    Reset Password
                  </button>

                  <button
                    disabled={loadingId === u.id}
                    onClick={() => toggleActive(u.id)}
                    className={`hover:underline ${
                      u.active ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {u.active ? "Disable" : "Enable"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {resetUserId && (
        <ResetPasswordModal
          userId={resetUserId}
          onClose={async () => {
            setResetUserId(null);
            await onReload();
          }}
        />
      )}
    </>
  );
}
