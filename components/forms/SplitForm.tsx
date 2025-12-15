"use client";

import { useEffect, useState } from "react";

interface BudgetItem {
  id: string;
  name: string;
  type: "OPEX" | "CAPEX";
  remaining: number;
}

export default function SplitForm() {
  const [items, setItems] = useState<BudgetItem[]>([]);
  const [fromItemId, setFromItemId] = useState("");
  const [toItemId, setToItemId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/budget")
      .then((r) => r.json())
      .then(setItems);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/split", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromItemId,
          toItemId,
          amount: Number(amount),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess("Split budget berhasil ✅");
      setFromItemId("");
      setToItemId("");
      setAmount("");
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <h2 className="text-xl font-semibold">Split Budget</h2>

      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">{success}</div>}

      <select
        value={fromItemId}
        onChange={(e) => setFromItemId(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">-- Dari Budget --</option>
        {items.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name} ({i.type}) — sisa {i.remaining}
          </option>
        ))}
      </select>

      <select
        value={toItemId}
        onChange={(e) => setToItemId(e.target.value)}
        className="w-full border p-2 rounded"
      >
        <option value="">-- Ke Budget --</option>
        {items.map((i) => (
          <option key={i.id} value={i.id}>
            {i.name} ({i.type})
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

      <button className="bg-purple-600 text-white px-4 py-2 rounded">
        Split Budget
      </button>
    </form>
  );
}
