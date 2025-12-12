"use client";

import { useEffect, useState } from "react";

export default function ActualForm() {
  const [items, setItems] = useState<any[]>([]);
  const [itemId, setItemId] = useState("");
  const [amount, setAmount] = useState(0);
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/budget");
      const data = await res.json();
      setItems(data);
    }
    load();
  }, []);

  async function submit(e: any) {
    e.preventDefault();
    setMessage("");

    const res = await fetch("/api/actual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, amount, note }),
    });

    const result = await res.json();

    if (!res.ok) {
      setMessage("❌ " + result.error);
      return;
    }

    setMessage("✅ Realisasi berhasil ditambahkan.");

    setAmount(0);
    setNote("");
  }

  return (
    <form onSubmit={submit} className="space-y-4 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-semibold">Input Actual (Realisasi)</h2>

      <div>
        <label>Pilih Budget Item</label>
        <select
          value={itemId}
          onChange={(e) => setItemId(e.target.value)}
          className="border p-2 w-full rounded"
        >
          <option value="">-- pilih item --</option>
          {items.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.name} — Remaining: {item.remaining}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="border p-2 w-full rounded"
        />
      </div>

      <div>
        <label>Note (optional)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </div>

      <button className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit
      </button>

      {message && <div className="mt-3">{message}</div>}
    </form>
  );
}
