"use client";

import { useState } from "react";

interface Props {
  userId: string;
  onClose: () => void;
}

export default function ResetPasswordModal({
  userId,
  onClose,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function resetPassword() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `/api/users/${userId}/reset-password`,
        { method: "POST" }
      );

      // ⛔ jangan langsung res.json()
      const text = await res.text();
      const data = text ? JSON.parse(text) : null;

      if (!res.ok) {
        throw new Error(data?.error || "Reset gagal");
      }

      setTempPassword(data.temporaryPassword);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold">
          Reset Password User
        </h2>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        {tempPassword ? (
          <>
            <p className="text-sm">
              Password sementara:
            </p>
            <div className="bg-gray-100 p-2 font-mono rounded">
              {tempPassword}
            </div>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Tutup
            </button>
          </>
        ) : (
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              onClick={resetPassword}
              disabled={loading}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              {loading ? "Reset..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
