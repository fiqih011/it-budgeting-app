"use client";

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
};

export default function CreateUserModal({
  open,
  onClose,
  onCreated,
}: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] =
    useState<"ADMIN" | "USER" | "VIEWER">("USER");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tempPassword, setTempPassword] =
    useState<string | null>(null);

  if (!open) return null;

  async function submit() {
    try {
      setLoading(true);
      setError(null);
      setTempPassword(null);

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Gagal membuat user");
      }

      setTempPassword(data.tempPassword);
      onCreated();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal membuat user"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Create User</h2>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {tempPassword ? (
          <div className="space-y-3">
            <p className="text-sm">
              User berhasil dibuat. Password sementara:
            </p>

            <div className="flex items-center gap-2">
              <code className="flex-1 bg-gray-100 p-2 rounded text-sm">
                {tempPassword}
              </code>
              <button
                onClick={() =>
                  navigator.clipboard.writeText(
                    tempPassword
                  )
                }
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
              >
                Copy
              </button>
            </div>

            <p className="text-xs text-gray-500">
              ⚠️ Password ini hanya muncul sekali.
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setEmail("");
                  setName("");
                  setRole("USER");
                  setTempPassword(null);
                  onClose();
                }}
                className="px-4 py-2 text-sm bg-green-600 text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <input
                placeholder="Name"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                className="w-full border p-2 rounded"
              />
              <input
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full border p-2 rounded"
              />
              <select
                value={role}
                onChange={(e) =>
                  setRole(
                    e.target.value as
                      | "ADMIN"
                      | "USER"
                      | "VIEWER"
                  )
                }
                className="w-full border p-2 rounded"
              >
                <option value="VIEWER">VIEWER</option>
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm border rounded"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={loading}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded"
              >
                {loading ? "Saving..." : "Create"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
