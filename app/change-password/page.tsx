"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

export default function ChangePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    if (!password || password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    if (password !== confirm) {
      setError("Password tidak sama");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Gagal ganti password");
      }

      // 🔑 WAJIB: refresh JWT
      await signOut({
  callbackUrl: "/login?passwordChanged=1",
});
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4"
      >
        <h1 className="text-lg font-semibold">
          Ganti Password
        </h1>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <input
          type="password"
          placeholder="Password baru"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full border p-2 rounded"
        />

        <input
          type="password"
          placeholder="Ulangi password"
          value={confirm}
          onChange={(e) =>
            setConfirm(e.target.value)
          }
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          {loading ? "Menyimpan..." : "Simpan Password"}
        </button>
      </form>
    </div>
  );
}
