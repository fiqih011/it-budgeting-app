"use client";

import { useEffect, useState } from "react";

interface BudgetItem {
  id: string;
  name: string;
  remaining: number;
}

export default function ActualForm() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [itemId, setItemId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/budget")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!itemId || !amount) {
      setError("Item dan amount wajib");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/actual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId,
          amount: Number(amount),
          note,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Realisasi berhasil disimpan ✅");
      setItemId("");
      setAmount("");
      setNote("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <h2 className="text-xl font-semibold">Input Actual (Realisasi)</h2>

      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      <select
        value={itemId}
        onChange={(e) => setItemId(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">-- Pilih Budget Item --</option>
        {items.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name} (sisa: {i.remaining})
          </option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <input
        placeholder="Note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Actual"}
      </button>
    </form>
  );
}
